using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Services;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Hubs
{
    public class SeatHub : Hub
    {
        private readonly SeatHubService _seatHubService;

        public SeatHub(SeatHubService seatHubService)
        {
            _seatHubService = seatHubService;
        }

        public async Task SendSeatHold(SeatHoldingRequest request)
        {
            await _seatHubService.SendSeatHold(request);
        }

        public async Task JoinGroup(Guid groupId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString("D"));
        }

        public async Task LeaveGroup(Guid groupId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId.ToString("D"));
        }
    }
}
