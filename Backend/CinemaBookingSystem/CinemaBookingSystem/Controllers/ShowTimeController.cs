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
    public class ShowTimeController : ControllerBase
    {
        private readonly ShowTimeService _showTimeService;

        public ShowTimeController(ShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createShowTime")]
        public async Task<IActionResult> CreateShwoTime(ShowTimeRequest showTimeRequest)
        {
            try
            {
                var result = await _showTimeService.createShowTime(showTimeRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListShowTime")]
        public async Task<IActionResult> GetListShowTime(int page, int pageSize, [FromQuery] FilterShowTime filterShowTime)
        {
            try
            {
                var result = await _showTimeService.getListShowTime(page, pageSize, filterShowTime);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getPaginationInfo")]
        public async Task<IActionResult> GetPaginationInfo(int pageSize, [FromQuery] FilterShowTime filterShowTime)
        {
            try
            {
                var result = await _showTimeService.getPaginationInfo(pageSize, filterShowTime);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateShowTime/{id}")]
        public async Task<IActionResult> UpdateShowTime(Guid id, ShowTimeRequest showTimeRequest)
        {
            try
            {
                var result = await _showTimeService.updateShowTime(id, showTimeRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteShowTime/{id}")]
        public async Task<IActionResult> DeleteShowTiem(Guid id)
        {
            try
            {
                var result = await _showTimeService.deleteShowTime(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListShowTimeByMovie/{id}")]
        public async Task<IActionResult> GetListShowTimeByMovie(Guid id, [FromQuery]FilterShowTime filter)
        {
            try
            {
                var result = await _showTimeService.getListShowTimeByMovie(id, filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListGroupByShowTimeByMovie/{id}")]
        public async Task<IActionResult> GetListGroupByShowTimeByMovie(Guid id)
        {
            try
            {
                var result = await _showTimeService.getListGroupByShowTimeByMovie(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
