using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class SeatHoldingService
    {
        private readonly MyDbContext _context;
        private readonly RedisService _redisServer;

        public SeatHoldingService(MyDbContext context, RedisService redisServer)
        {
            _context = context;
            _redisServer = redisServer;
        }

        public async Task<List<SeatHoldingResponse>> getListSeatHolding(Guid showTimeID)
        {
            var listSeatHoldingId = await _redisServer.GetSetAsync($"seatHold:{showTimeID}");
            var listSeatHoding = new List<SeatHoldingResponse>();

            for(var i = 0; i < listSeatHoldingId.Count; i++)
            {
                var seatId = listSeatHoldingId[i];

                var userId = await _redisServer.GetAsync($"seatHold:{showTimeID}:{seatId}");

                if(!string.IsNullOrWhiteSpace(userId))
                {
                    var result = new SeatHoldingResponse
                    {
                        SeatID = Guid.Parse(seatId),
                        UserID = Guid.Parse(userId),
                        ShowTimeID = showTimeID
                    };

                    var expireTime = await _redisServer.GetExpireAtAsync($"seatHold:{showTimeID}:{seatId}");
                    if(expireTime != null)
                    {
                        result.ExpireTime = expireTime.Value;
                    }

                    listSeatHoding.Add(result);
                }
            }
            return listSeatHoding;
        }

        public async Task<bool> createSeatHolding(SeatHoldingRequest request)
        {
            var seat = await _context.Seats.AnyAsync(s => s.SeatID == request.SeatID);
            if(!seat)
            {
                throw new BadRequestException("Không tồn tại ghế này");
            }

            var user = await _context.Users.AnyAsync(u => u.UserID == request.UserID);
            if(!user)
            {
                throw new BadRequestException("Không tồn tại user này");
            }

            var showTime = await _context.ShowTimes.AnyAsync(st => st.ShowTimeID == request.ShowTimeID);
            if(!showTime)
            {
                throw new BadRequestException("Không tồn tại suất chiếu này");
            }

            var script = @"
                local currentUser = redis.call('GET', KEYS[1])

                if not currentUser then
                    local ok = redis.call('SET', KEYS[1], ARGV[1], 'NX', 'EX', 60)

                    if ok then
                        redis.call('SADD', KEYS[2], ARGV[2])
                        return 1
                    else
                        return -1
                    end
                end

                if currentUser == ARGV[1] then
                    redis.call('DEL', KEYS[1])
                    redis.call('SREM', KEYS[2], ARGV[2])
                    return 2
                end

                return 0";

            var result = (int)(await _redisServer.ExecuteScriptAsync(
                script,
                new RedisKey[]
                {
                    $"seatHold:{request.ShowTimeID}:{request.SeatID}",
                    $"seatHold:{request.ShowTimeID}"
                },
                new RedisValue[]
                {
                    request.UserID.ToString(),
                    request.SeatID.ToString()
                }
            ));

            if (result == 1)
                return true;

            if (result == 2)
                return true; 

            if (result == 0)
                throw new BadRequestException("Ghế này đã có người giữ");

            throw new BadRequestException("Ghế vừa bị người khác giữ");
        }
    }
}
