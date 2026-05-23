using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StackExchange.Redis;

namespace CinemaBookingSystem.Services
{
    public class RedisSubscriberService : BackgroundService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly RedisService _redisService;
        private readonly IServiceProvider _serviceProvider;

        public RedisSubscriberService(
            IConnectionMultiplexer redis,
            RedisService redisService,
            IServiceProvider serviceProvider)
        {
            _redis = redis;
            _redisService = redisService;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sub = _redis.GetSubscriber();

            await sub.SubscribeAsync("__keyevent@0__:expired", (channel, value) =>
            {
                var expiredKey = value.ToString();
                _ = HandleSeatExpired(expiredKey);
            });
        }

        private async Task HandleSeatExpired(string key)
        {
            if (key.StartsWith("seatHold:"))
            {
                var parts = key.Split(':');
                var showTimeID = parts[1];
                var seatID = parts[2];

                await _redisService.RemoveFromSetAsync($"seatHold:{showTimeID}", seatID);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var seatHubService = scope.ServiceProvider.GetRequiredService<SeatHubService>();
                    await seatHubService.SendBroadCastAllGroup(Guid.Parse(showTimeID));
                }
            }

            if (key.StartsWith("bookingDraft:"))
            {
                var parts = key.Split(':');
                var showTimeID = parts[2];
                var userID = parts[3];

                var indexKey = $"bookingDraftIndex:{showTimeID}:{userID}";

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

                var keys = new RedisKey[] { "dummy" };
                var values = new RedisValue[]
                {
                    showTimeID,
                    userID,
                    indexKey
                };

                await _redisService.ExecuteScriptAsync(script, keys, values);

                using (var scope = _serviceProvider.CreateScope())
                {
                    var seatHubService = scope.ServiceProvider.GetRequiredService<SeatHubService>();
                    await seatHubService.SendBroadCastAllGroup(Guid.Parse(showTimeID));
                }
            }
        }
    }
}
