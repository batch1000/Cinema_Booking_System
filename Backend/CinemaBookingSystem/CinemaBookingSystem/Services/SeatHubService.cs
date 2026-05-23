using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Hubs;
using CinemaBookingSystem.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class SeatHubService
    {
        private readonly IHubContext<SeatHub> _hubContext;
        private readonly MyDbContext _dbContext;
        private readonly SeatHoldingService _seatHoldingService;

        public SeatHubService(IHubContext<SeatHub> hubContext, MyDbContext dbContext, SeatHoldingService seatHoldingService)
        {
            _hubContext = hubContext;
            _dbContext = dbContext;
            _seatHoldingService = seatHoldingService;
        }

        public async Task SendSeatHold(SeatHoldingRequest request)
        {
            var result = await _seatHoldingService.createSeatHolding(request);
            
            if(result)
            {
                await _hubContext.Clients
                    .Group(request.ShowTimeID.ToString("D"))
                    .SendAsync("ReceiveSeatHold", request);
            }
        }

        public async Task SendBroadCastAllGroup(Guid showTimeID)
        {
            var result = new { showTimeID = showTimeID};
            await _hubContext.Clients
                    .Group(showTimeID.ToString("D"))
                    .SendAsync("ReceiveSeatHold", result);
        }
    }
}
