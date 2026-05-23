using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatController : ControllerBase
    {
        private readonly SeatService _seatService;

        public SeatController(SeatService seatService)
        {
            _seatService = seatService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateListSeat")]
        public async Task<IActionResult> UpdateListSeat(List<SeatRequest> listSeatRequest)
        {
            try
            {
                var result = await _seatService.updateListSeat(listSeatRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
