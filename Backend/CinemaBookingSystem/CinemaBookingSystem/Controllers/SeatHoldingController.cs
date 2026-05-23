using CinemaBookingSystem.Services;
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
    public class SeatHoldingController : ControllerBase
    {
        private readonly SeatHoldingService _seatHoldingService;

        public SeatHoldingController(SeatHoldingService seatHoldingService)
        {
            _seatHoldingService = seatHoldingService;
        }

        [HttpGet("getListSeatHolding/{showTimeID}")]
        public async Task<IActionResult> GetListSeatHolding(Guid showTimeID)
        {
            try
            {
                var result = await _seatHoldingService.getListSeatHolding(showTimeID);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }


}
