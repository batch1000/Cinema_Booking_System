using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class RedisPollingService : BackgroundService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly RedisService _redisService;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<RedisPollingService> _logger;
        private readonly TimeSpan _pollInterval = TimeSpan.FromSeconds(5);

        public RedisPollingService(
            IConnectionMultiplexer redis,
            RedisService redisService,
            IServiceProvider serviceProvider,
            ILogger<RedisPollingService> logger)
        {
            _redis = redis;
            _redisService = redisService;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await Task.WhenAll(
                        ScanExpiredSeatHolds(),
                        ScanExpiredBookingDrafts()
                    );
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Lỗi polling Redis");
                }

                await Task.Delay(_pollInterval, stoppingToken);
            }
        }

        // -------------------------------------------------------
        // Quét seatHold:{showTimeID} (set tổng) — đã có sẵn
        // Từ set tổng → check từng seatHold:{showTimeID}:{seatID}
        // -------------------------------------------------------
        private async Task ScanExpiredSeatHolds()
        {
            var db = _redis.GetDatabase();
            var server = _redis.GetServer(_redis.GetEndPoints()[0]);

            // SCAN tìm tất cả set tổng: seatHold:{showTimeID} (không có phần :seatID)
            var setKeys = server.KeysAsync(pattern: "seatHold:*");

            await foreach (var setKey in setKeys)
            {
                var keyStr = setKey.ToString();

                // Bỏ qua key dạng seatHold:{showTimeID}:{seatID} — chỉ lấy set tổng
                if (keyStr.Split(':').Length != 2) continue;

                var showTimeID = keyStr.Split(':')[1];
                var members = await db.SetMembersAsync(setKey);
                bool hasExpired = false;

                foreach (var seatIdVal in members)
                {
                    var seatKey = $"seatHold:{showTimeID}:{seatIdVal}";
                    var exists = await db.KeyExistsAsync(seatKey);

                    if (!exists)
                    {
                        await db.SetRemoveAsync(setKey, seatIdVal);
                        hasExpired = true;
                        _logger.LogInformation("Seat expired: ShowTime={ShowTime} Seat={Seat}", showTimeID, seatIdVal);
                    }
                }

                if (hasExpired)
                    await BroadcastSeatUpdate(showTimeID);
            }
        }

        // -------------------------------------------------------
        // SCAN bookingDraftIndex:{showTimeID}:{userID}
        // Nếu key còn nhưng bookingDraft tương ứng đã hết → cleanup
        // -------------------------------------------------------
        private async Task ScanExpiredBookingDrafts()
        {
            var db = _redis.GetDatabase();
            var server = _redis.GetServer(_redis.GetEndPoints()[0]);

            // Scan tất cả seatHold set tổng (TTL 6 phút, sống lâu hơn bookingDraftIndex)
            var setKeys = server.KeysAsync(pattern: "seatHold:*");

            await foreach (var setKey in setKeys)
            {
                var keyStr = setKey.ToString();
                // Chỉ lấy set tổng seatHold:{showTimeID}, bỏ seatHold:{showTimeID}:{seatID}
                if (keyStr.Split(':').Length != 2) continue;

                var showTimeID = keyStr.Split(':')[1];
                var members = await db.SetMembersAsync(setKey);

                // Thu thập userID đang giữ ghế từ các seatHold key còn sống
                var activeOwners = new HashSet<string>();
                foreach (var seatIdVal in members)
                {
                    var seatKey = $"seatHold:{showTimeID}:{seatIdVal}";
                    var owner = await db.StringGetAsync(seatKey);
                    if (!owner.IsNullOrEmpty)
                        activeOwners.Add(owner.ToString());
                }

                // Với mỗi owner đang giữ ghế, check xem bookingDraftIndex còn không
                // Nếu không còn → booking draft đã expire nhưng ghế chưa được dọn
                foreach (var userID in activeOwners)
                {
                    var indexKey = $"bookingDraftIndex:{showTimeID}:{userID}";
                    var indexExists = await db.KeyExistsAsync(indexKey);

                    if (indexExists)
                    {
                        // bookingDraftIndex còn sống → check bookingDraft tương ứng
                        var bookingDraftId = await db.StringGetAsync(indexKey);
                        if (bookingDraftId.IsNullOrEmpty) continue;

                        var bookingDraftKey = $"bookingDraft:{bookingDraftId}:{showTimeID}:{userID}";
                        var draftExists = await db.KeyExistsAsync(bookingDraftKey);

                        if (!draftExists)
                        {
                            // bookingDraft chết nhưng indexKey chưa kịp expire
                            _logger.LogInformation("BookingDraft expired (index still alive): ShowTime={ShowTime} User={User}", showTimeID, userID);
                            await HandleBookingDraftExpired(db, showTimeID, userID);
                        }
                    }
                    else
                    {
                        // indexKey không tồn tại → có thể chưa tạo draft (bình thường)
                        // hoặc đã expire cùng lúc với bookingDraft → cần kiểm tra thêm
                        // Dấu hiệu nhận biết: seatHold key của user này có TTL > 60s không?
                        // Nếu TTL còn rất cao (>60s) → đây là ghế được gia hạn bởi booking draft
                        // → draft đã expire nhưng index cũng expire → cần cleanup

                        foreach (var seatIdVal in members)
                        {
                            var seatKey = $"seatHold:{showTimeID}:{seatIdVal}";
                            var owner = await db.StringGetAsync(seatKey);
                            if (owner.IsNullOrEmpty || owner.ToString() != userID) continue;

                            var ttl = await db.KeyTimeToLiveAsync(seatKey);
                            // Ghế bình thường TTL max 60s, nếu > 60s → được gia hạn bởi booking draft
                            if (ttl.HasValue && ttl.Value.TotalSeconds > 60)
                            {
                                _logger.LogInformation("BookingDraft expired (both keys gone): ShowTime={ShowTime} User={User}", showTimeID, userID);
                                await HandleBookingDraftExpired(db, showTimeID, userID);
                                break; // Đã xử lý user này rồi, không cần check ghế khác
                            }
                        }
                    }
                }
            }
        }

        private async Task HandleBookingDraftExpired(IDatabase db, string showTimeID, string userID)
        {
            // Giữ nguyên y hệt Lua script trong RedisSubscriberService cũ
            var script = @"
                local showTimeID = ARGV[1]
                local userID = ARGV[2]
                local indexKey = ARGV[3]
                local setKey = 'seatHold:' .. showTimeID
                local seats = redis.call('SMEMBERS', setKey)

                for i = 1, #seats do
                    local seatID = seats[i]
                    local seatKey = 'seatHold:' .. showTimeID .. ':' .. seatID
                    local owner = redis.call('GET', seatKey)
                    if owner and owner == userID then
                        redis.call('DEL', seatKey)
                        redis.call('SREM', setKey, seatID)
                    end
                end

                redis.call('DEL', indexKey)
                return 1";

            var indexKey = $"bookingDraftIndex:{showTimeID}:{userID}";

            await _redisService.ExecuteScriptAsync(
                script,
                new RedisKey[] { "dummy" },
                new RedisValue[] { showTimeID, userID, indexKey }
            );

            await BroadcastSeatUpdate(showTimeID);
        }

        private async Task BroadcastSeatUpdate(string showTimeID)
        {
            using var scope = _serviceProvider.CreateScope();
            var hub = scope.ServiceProvider.GetRequiredService<SeatHubService>();
            await hub.SendBroadCastAllGroup(Guid.Parse(showTimeID));
        }
    }
}
