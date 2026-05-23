using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class BookingService
    {
        private readonly RedisService _redisService;
        private readonly MyDbContext _context;
        private readonly SeatHubService _seatHubService;

        public BookingService(RedisService redisService, MyDbContext context, SeatHubService seatHubService)
        {
            _redisService = redisService;
            _context = context;
            _seatHubService = seatHubService;
        }

        public async Task<string> createBookingDraft(BookingRequest request)
        {
            var user = await _context.Users.AnyAsync(u => u.UserID == request.UserID);
            if (!user)
            {
                throw new BadRequestException("Không tồn tại user này");
            }

            var showTime = await _context.ShowTimes.AnyAsync(st => st.ShowTimeID == request.ShowTimeID);
            if (!showTime)
            {
                throw new BadRequestException("Không tồn tại suất chiếu này");
            }

            var bookingDraftID = Guid.NewGuid();

            var script = @"
            -- KEYS:
            -- 1..N: seatHold keys
            -- N+1: bookingDraft key
            -- N+2: bookingDraftIndex key 
            -- ARGV:
            -- 1: userID
            -- 2: seatTTL (seconds)
            -- 3: bookingTTL (seconds)
            local userID = ARGV[1]
            local seatTTL = tonumber(ARGV[2])
            local bookingTTL = tonumber(ARGV[3])
            local bookingDraftID = ARGV[4]
            local seatCount = #KEYS - 2  

            local indexKey = KEYS[seatCount + 2]
            local existingDraft = redis.call('GET', indexKey)
            if existingDraft then
                return -1  -- đã tồn tại booking draft
            end

            -- 1. Check tất cả ghế
            for i = 1, seatCount do
                local val = redis.call('GET', KEYS[i])
                if not val or val ~= userID then
                    return 0
                end
            end

            -- 2. Gia hạn TTL tất cả ghế
            for i = 1, seatCount do
                redis.call('EXPIRE', KEYS[i], seatTTL)
            end

            -- 3. Tạo bookingDraft
            redis.call('SET', KEYS[seatCount + 1], userID, 'EX', bookingTTL)

            -- 4. Tạo index key
            redis.call('SET', indexKey, bookingDraftID, 'EX', bookingTTL)

            return 1";

            var seatKeys = request.ListSelectSeatID
                .Select(seatID => (RedisKey)$"seatHold:{request.ShowTimeID}:{seatID}")
                .ToList();

            var bookingKey = (RedisKey)$"bookingDraft:{bookingDraftID}:{request.ShowTimeID}:{request.UserID}";
            var indexKey = (RedisKey)$"bookingDraftIndex:{request.ShowTimeID}:{request.UserID}";

            var keys = seatKeys
               .Append(bookingKey)
               .Append(indexKey)
               .ToArray();

            var values = new RedisValue[]
            {
                request.UserID.ToString(),
                360, // 6 phút giữ ghế
                120,  // 2 phút booking draft
                bookingDraftID.ToString()
            };

            var result = (int)(await _redisService.ExecuteScriptAsync(script, keys, values));

            if (result == 1)
            {
                return bookingDraftID.ToString();
            }

            if (result == -1)
            {
                throw new BadRequestException("Bạn đã có một booking đang chờ xử lý cho suất chiếu này");
            }

            await _seatHubService.SendBroadCastAllGroup(request.ShowTimeID);
            throw new BadRequestException("Một số ghế bạn chọn đã không còn khả dụng");
        }

        public async Task<BookingResponse> getBookingDraft(GetBookingRequest request)
        {
            var bookingKey = $"bookingDraft:{request.BookingDraftID}:{request.ShowTimeID}:{request.UserID}";
            var userID = await _redisService.GetAsync(bookingKey);

            if(!string.IsNullOrWhiteSpace(userID))
            {
                var listHoldingSeatKey = $"seatHold:{request.ShowTimeID}";
                var listAllSeatHolding = await _redisService.GetSetAsync(listHoldingSeatKey);
                if(listAllSeatHolding == null)
                {
                    return null;
                }

                List<Guid> listSeatHoldingByUser = new List<Guid>();

                for(var i = 0; i < listAllSeatHolding.Count; i++)
                {
                    var seatID = listAllSeatHolding[i];
                    var ownerSeat = await _redisService.GetAsync($"seatHold:{request.ShowTimeID}:{seatID}");
                    if(!string.IsNullOrWhiteSpace(ownerSeat) && ownerSeat == userID)
                    {
                        listSeatHoldingByUser.Add(Guid.Parse(seatID));
                    }
                }

                if(listSeatHoldingByUser.Count == 0)
                {
                    return null;
                }

                var result = await _context.ShowTimes
                    .Where(st => st.ShowTimeID == request.ShowTimeID)
                    .Select(st => new BookingResponse
                    {
                        ShowTime = new ShowTimeResponse
                        {
                            ShowTimeID = st.ShowTimeID,
                            StartTime = st.StartTime,
                            EndTime = st.EndTime,
                            Price = st.Price,
                            Movie = new MovieReponse
                            {
                                MovieID = st.Movie.MovieID,
                                Title = st.Movie.Title,
                                PosterUrl = st.Movie.PosterUrl,
                                AgeRating = st.Movie.AgeRating,
                                Duration = st.Movie.Duration,
                                ProductionYear = st.Movie.ProductionYear
                            },
                            Room = new RoomResponse
                            {
                                RoomID = st.Room.RoomID,
                                Name = st.Room.Name,
                                Cinema = new CinemaResponse
                                {
                                    CinemaID = st.Room.Cinema.CinemaID,
                                    Name = st.Room.Cinema.Name,
                                    Address = st.Room.Cinema.Address
                                },
                                ListSeat = st.Room.Seats
                                    .Where(s => listSeatHoldingByUser.Contains(s.SeatID))
                                    .Select(s => new SeatResponse
                                    {
                                        SeatID = s.SeatID,
                                        SeatNumber = s.SeatNumber,
                                        SeatType = new SeatTypeResponse { 
                                            SeatTypeID = s.SeatType.SeatTypeID,
                                            Name = s.SeatType.Name,
                                            PriceMultiplier = s.SeatType.PriceMultiplier,
                                            Color = s.SeatType.Color
                                        }
                                    })
                                    .ToList()

                            }
                        }
                    })
                    .FirstOrDefaultAsync();

                var expireTime = await _redisService.GetExpireAtAsync(bookingKey);
                result.ExpireTime = expireTime.Value;
                return result;

            }
            return null;
        }

        public async Task<bool> deleteBookingDraft(GetBookingRequest request)
        {
            var bookingDraftID = request.BookingDraftID;

            var keyBooking = $"bookingDraft:{bookingDraftID}:{request.ShowTimeID}:{request.UserID}";
            var indexKey = $"bookingDraftIndex:{request.ShowTimeID}:{request.UserID}";

            var script = @"
                local showTimeID = ARGV[1]
                local userID = ARGV[2]
                local bookingKey = ARGV[3]
                local indexKey = ARGV[4]

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

                -- xóa booking draft
                redis.call('DEL', bookingKey)
                redis.call('DEL', indexKey)

                return 1";

            var keys = new RedisKey[] { "dummy" };
            var values = new RedisValue[]
            {
                request.ShowTimeID.ToString(),
                request.UserID.ToString(),
                keyBooking,
                indexKey
            };

            await _redisService.ExecuteScriptAsync(script, keys, values);

            return true;
        }

        public async Task<object> createPaymentIntent(PaymentIntentRequest request)
        {
            var showTimeID = request.ShowTimeID;
            var userID = request.UserID;

            var user = await _context.Users.AnyAsync(u => u.UserID == request.UserID);
            if (!user)
            {
                throw new BadRequestException("Không tồn tại user này");
            }

            var showTime = await _context.ShowTimes.AnyAsync(st => st.ShowTimeID == request.ShowTimeID);
            if (!showTime)
            {
                throw new BadRequestException("Không tồn tại suất chiếu này");
            }

            var listSeatHoldingByUser = new List<string>();

            var script = @"
            local seatIDs = redis.call('SMEMBERS', KEYS[1])
            local result = {}

            for i = 1, #seatIDs do
                local seatID = seatIDs[i]
                local owner = redis.call('GET', KEYS[1] .. ':' .. seatID)

                if owner == ARGV[1] then
                    table.insert(result, seatID)
                end
            end

            return result";

            var redisResult = (RedisResult[])(await _redisService.ExecuteScriptAsync(
                script,
                new RedisKey[]
                {
                    $"seatHold:{showTimeID}"
                },
                new RedisValue[]
                {
                    userID.ToString()
                }
            ));

            listSeatHoldingByUser = redisResult
                .Select(r => r.ToString())
                .ToList();

            if (listSeatHoldingByUser.Count == 0)
            {
                throw new BadRequestException("Số tiền không hợp lệ");
            }

            var amount = 0;
            var priceShowTime = await _context.ShowTimes
                .Where(st => st.ShowTimeID == showTimeID)
                .Select(st => st.Price)
                .FirstOrDefaultAsync();

            var listSeat = await _context.ShowTimes
                .Where(st => st.ShowTimeID == showTimeID)
                .SelectMany(st => st.Room.Seats)
                .Include(s => s.SeatType)
                .ToListAsync();

            for (var i = 0; i < listSeatHoldingByUser.Count; i++)
            {
                var seatID = listSeatHoldingByUser[i];

                var seat = listSeat.Find(s => s.SeatID.ToString() == seatID);

                if(seat != null)
                {
                    amount += (int)(priceShowTime * seat.SeatType.PriceMultiplier);
                }
            }

            if(amount == 0)
            {
                throw new BadRequestException("Số tiền không hợp lệ");
            }

            var options = new PaymentIntentCreateOptions
            {
                Amount = amount, 
                Currency = "vnd", 
                Metadata = new Dictionary<string, string>
                {
                    { "BookingDraftID", request.BookingDraftID.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var requestOptions = new RequestOptions
            {
                IdempotencyKey = request.BookingDraftID.ToString()
            };

            var paymentIntent = await service.CreateAsync(options, requestOptions);

            return new
            {
                clientSecret = paymentIntent.ClientSecret
            };
        }

        public async Task<object> checkBookingDraftExist(BookingDraftExistRequest request)
        {
            var bookingDraftID = await _redisService.GetAsync($"bookingDraftIndex:{request.ShowTimeID}:{request.UserID}");

            if (string.IsNullOrWhiteSpace(bookingDraftID))
            {
                return null;
            }

            var expireTime = await _redisService.GetExpireAtAsync($"bookingDraft:{bookingDraftID}:{request.ShowTimeID}:{request.UserID}");
            if (expireTime == null)
            {
                return null;
            }
        
            return new { 
                bookingDraftID,
                expireTime
            };
        }

        public async Task<bool> refreshTimeToLiveBooking(GetBookingRequest request)
        {
            var script = @"local bookingDraftID = ARGV[1]
                local showTimeID = ARGV[2]
                local userID = ARGV[3]

                local bookingKey = 'bookingDraft:' .. bookingDraftID .. ':' .. showTimeID .. ':' .. userID
                local indexKey = 'bookingDraftIndex:' .. showTimeID .. ':' .. userID
                local tryPaymentKey = 'tryPayment:' .. bookingDraftID
                local setKey = 'seatHold:' .. showTimeID

                local bookingAlive = redis.call('GET', bookingKey)
                if not bookingAlive then
                    return redis.error_reply('BOOKING_EXPIRED')
                end

                local tryPayment = redis.call('GET', tryPaymentKey)

                if not tryPayment then
                    redis.call('SET', tryPaymentKey, '1', 'EX', 420)
                else
                    local times = tonumber(tryPayment)

                    if times > 3 then
                        local seats = redis.call('SMEMBERS', setKey)

                        for i = 1, #seats do
                            local seatID = seats[i]
                            local seatKey = 'seatHold:'..showTimeID..':'..seatID

                            local owner = redis.call('GET', seatKey)
                            if owner and owner == userID then
                                redis.call('DEL', seatKey)
                                redis.call('SREM', setKey, seatID)
                            end
                        end

                        redis.call('DEL', bookingKey)
                        redis.call('DEL', tryPaymentKey)
                        redis.call('DEL', indexKey)

                        return redis.error_reply('PAYMENT_LIMIT_EXCEEDED')
                    else
                        times = times + 1
                        redis.call('SET', tryPaymentKey, tostring(times), 'EX', 420)
                    end
                end

                redis.call('EXPIRE', bookingKey, 120)
                redis.call('EXPIRE', indexKey, 120)

                local seats = redis.call('SMEMBERS', setKey)

                for i = 1, #seats do
                    local seatID = seats[i]
                    local seatKey = 'seatHold:'..showTimeID..':'..seatID

                    local owner = redis.call('GET', seatKey)
                    if owner and owner == userID then
                        redis.call('EXPIRE', seatKey, 360)
                    end
                end

                return 'OK'";

            var keys = new RedisKey[] { "dummy" };
            var values = new RedisValue[]
            {
                request.BookingDraftID.ToString(),
                request.ShowTimeID.ToString(),
                request.UserID.ToString()
            };

            try
            {
                var result = await _redisService.ExecuteScriptAsync(script, keys, values);
                return true;
            }
            catch (RedisServerException ex)
            {
                if (ex.Message.Contains("BOOKING_EXPIRED"))
                    throw new BadRequestException("Đã hết thời gian thanh toán");

                if (ex.Message.Contains("PAYMENT_LIMIT_EXCEEDED"))
                {
                    await _seatHubService.SendBroadCastAllGroup(request.ShowTimeID);
                    throw new BadRequestException("Đã quá giới hạn số lần chuyển khoản");
                }

                throw;
            }
        }

        public async Task<object> confirmPayment(ConfirmPaymentRequest request)
        {
            var service = new PaymentIntentService();
            var paymentIntent = await service.GetAsync(request.PaymentIntentId);

            if (paymentIntent.Status != "succeeded")
            {
                throw new BadRequestException($"Payment chưa thành công. Status: {paymentIntent.Status}");
            }

            if(paymentIntent.Amount != paymentIntent.AmountReceived)
            {
                throw new BadRequestException("Số tiền chuyển không chính xác");
            }


            var listSeatByUser = new List<Guid>();

            var listSeatHolding = await _redisService.GetSetAsync($"seatHold:{request.ShowTimeID}");
            if(listSeatHolding == null || listSeatHolding.Count == 0)
            {
                throw new BadRequestException("Không lấy được chỗ ngồi");
            }

            for(var i = 0; i < listSeatHolding.Count; i++)
            {
                var seatID = listSeatHolding[i];

                var owner = await _redisService.GetAsync($"seatHold:{request.ShowTimeID}:{seatID}");
                if(owner == request.UserID.ToString())
                {
                    listSeatByUser.Add(Guid.Parse(seatID));
                }
            }

            if (listSeatByUser.Count == 0)
            {
                throw new BadRequestException("Không lấy được chỗ ngồi");
            }

            var booking = new Booking
            {
                BookingID = Guid.NewGuid(),
                TotalPrice = (int)paymentIntent.Amount,
                CreateAt = DateTime.Now,
                UserID = request.UserID,
                ShowTimeID = request.ShowTimeID
            };
            _context.Bookings.Add(booking);

            var listBookingSeat = new List<BookingSeat>();
            for(var i = 0; i < listSeatByUser.Count; i++)
            {
                var seatID = listSeatByUser[i];
                listBookingSeat.Add(new BookingSeat {
                    BookingSeatID = Guid.NewGuid(),
                    BookingID = booking.BookingID,
                    SeatID = seatID
                });
            }
            _context.BookingSeats.AddRange(listBookingSeat);

            var payment = new Payment
            {
                PaymentID = Guid.NewGuid(),
                Amount = (int)paymentIntent.AmountReceived,
                CreateAt = DateTime.Now,
                BookingID = booking.BookingID
            };
            _context.Payments.Add(payment);

            await deleteBookingDraft(new GetBookingRequest
            {
                BookingDraftID = request.BookingDraftID,
                ShowTimeID = request.ShowTimeID,
                UserID = request.UserID
            });

            await _context.SaveChangesAsync();

            await _redisService.RemoveAsync($"tryPayment:{request.BookingDraftID}");
            await _seatHubService.SendBroadCastAllGroup(request.ShowTimeID);

            return new
            {
                message = "Payment verified",
                paymentIntentId = paymentIntent.Id,
                amount = paymentIntent.Amount,
                status = paymentIntent.Status
            };
        }

        public async Task<List<BookedResponse>> getListBooking(int page, int pageSize, FilterBooking filter)
        {
            var query =  _context.Bookings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Keyword))
            {
                query = query.Where(bk =>
                    bk.User.FirstName.Contains(filter.Keyword) ||
                    bk.User.LastName.Contains(filter.Keyword) ||
                    bk.ShowTime.Movie.Title.Contains(filter.Keyword)
                );
            }

            if (filter.Date.HasValue)
            {
                query = query.Where(bk => bk.ShowTime.StartTime.Date == filter.Date.Value.Date);
            }

            if (!string.IsNullOrWhiteSpace(filter.UserID))
            {
                query = query.Where(bk => bk.User.UserID.ToString() == filter.UserID);
            }

            var result = await query
                .OrderByDescending(bk => bk.CreateAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(bk => new BookedResponse
                {
                   BookingID = bk.BookingID,
                   TotalPrice = bk.TotalPrice,
                   CreateAt = bk.CreateAt,

                   User = new UserResponse
                   {
                       UserID = bk.User.UserID,
                       FirstName = bk.User.FirstName,
                       LastName = bk.User.LastName,
                       Email = bk.User.Email,
                       PhoneNumber = bk.User.PhoneNumber,
                       Role = bk.User.Role
                   },

                   Payment = new PaymentResponse
                   {
                       PaymentID = bk.Payment.PaymentID,
                       Amount = bk.Payment.Amount,
                       CreateAt = bk.Payment.CreateAt
                   },

                   ShowTime = new ShowTimeResponse {
                        ShowTimeID = bk.ShowTime.ShowTimeID,
                        StartTime = bk.ShowTime.StartTime,
                        EndTime = bk.ShowTime.EndTime,
                        Price = bk.ShowTime.Price,
                        Room = new RoomResponse
                        {
                            RoomID = bk.ShowTime.Room.RoomID,
                            Name = bk.ShowTime.Room.Name,
                            Cinema = new CinemaResponse
                            {
                                CinemaID = bk.ShowTime.Room.Cinema.CinemaID,
                                Name = bk.ShowTime.Room.Cinema.Name,
                                Address = bk.ShowTime.Room.Cinema.Address
                            }
                        },
                        Movie = new MovieReponse
                        {
                            MovieID = bk.ShowTime.Movie.MovieID,
                            Title = bk.ShowTime.Movie.Title,
                            PosterUrl = bk.ShowTime.Movie.PosterUrl
                        }
                   },

                   BookingSeats = bk.BookingSeats
                    .Select(s => new BookingSeatResponse
                    {
                        BookingSeatID = s.BookingSeatID,
                        Seat = new SeatResponse
                        {
                            SeatID = s.Seat.SeatID,
                            SeatNumber = s.Seat.SeatNumber,
                            SeatType = new SeatTypeResponse
                            {
                                SeatTypeID = s.Seat.SeatType.SeatTypeID,
                                Name = s.Seat.SeatType.Name
                            }
                        }
                    })
                    .ToList()
                })
                .ToListAsync();

            return result;
        }

        public async Task<object> getPaginationInfo(int pageSize, FilterBooking filter)
        {
            var query = _context.Bookings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Keyword))
            {
                query = query.Where(bk =>
                    bk.User.FirstName.Contains(filter.Keyword) ||
                    bk.User.LastName.Contains(filter.Keyword) ||
                    bk.ShowTime.Movie.Title.Contains(filter.Keyword)
                );
            }

            if (filter.Date.HasValue)
            {
                query = query.Where(bk => bk.ShowTime.StartTime.Date == filter.Date.Value.Date);
            }

            if (!string.IsNullOrWhiteSpace(filter.UserID))
            {
                query = query.Where(bk => bk.User.UserID.ToString() == filter.UserID);
            }

            var totalItem = await query.CountAsync();
            var totalPage = (int)Math.Ceiling((double)totalItem / pageSize);
            var totalPriceSum = await query.SumAsync(bk => bk.TotalPrice);

            return new { totalItem, totalPage, totalPriceSum };
        }

        public async Task<List<BookedSeatResponse>> getListBookedSeat(Guid showTimeID)
        {
            var result = await _context.Bookings
                .Where(bk => bk.ShowTimeID == showTimeID)
                .SelectMany(bk => bk.BookingSeats
                    .Select(bs => new BookedSeatResponse { 
                        SeatID = bs.SeatID,
                        UserID = bk.UserID
                    })
                )
                .ToListAsync();

            return result;
        }
    }
}
