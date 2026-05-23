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
    public class SeatTypeController : ControllerBase
    {
        private readonly SeatTypeService _seatTypeService;

        public SeatTypeController(SeatTypeService seatTypeService)
        {
            _seatTypeService = seatTypeService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createSeatType")]
        public async Task<IActionResult> CreateSeatType(SeatTypeRequest seatTypeRequest)
        {
            try
            {
                var result = await _seatTypeService.createSeatType(seatTypeRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListSeatType")]
        public async Task<IActionResult> GetListSeatType()
        {
            try
            {
                var result = await _seatTypeService.getListSeatType();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateSeatType/{id}")]
        public async Task<IActionResult> UpdateSeatType(Guid id, SeatTypeRequest seatTypeRequest)
        {
            try
            {
                var result = await _seatTypeService.updateSeatType(id, seatTypeRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteSeatType/{id}")]
        public async Task<IActionResult> DeleteSeatType(Guid id)
        {
            try
            {
                var result = await _seatTypeService.deleteSeatType(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
