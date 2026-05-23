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
    public class CinemaController : ControllerBase
    {
        private readonly CinemaService _cinemaService;

        public CinemaController(CinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createCinema")]
        public async Task<IActionResult> CreateCinema(CinemaRequest cinemaRequest)
        {
            try
            {
                var result = await _cinemaService.createCinema(cinemaRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListCinema")]
        public async Task<IActionResult> GetListCinema(int page, int pageSize, [FromQuery] FilterCinema filterCinema)
        {
            try
            {
                var result = await _cinemaService.getListCinema(page, pageSize, filterCinema);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getAllListCinema")]
        public async Task<IActionResult> GetAllListCinema()
        {
            try
            {
                var result = await _cinemaService.getAllListCinema();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getAllListCinemaShowTime")]
        public async Task<IActionResult> GetAllListCinemaShowTime()
        {
            try
            {
                var result = await _cinemaService.getAllListCinemaShowTime();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getPaginationInfo")]
        public async Task<IActionResult> GetPaginationInfo(int pageSize, [FromQuery] FilterCinema filterCinema)
        {
            try
            {
                var result = await _cinemaService.getPaginationInfo(pageSize, filterCinema);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateCinema/{id}")]
        public async Task<IActionResult> UpdateCinema(Guid id, CinemaRequest cinemaRequest)
        {
            try
            {
                var result = await _cinemaService.updateCinema(id, cinemaRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteCinema/{id}")]
        public async Task<IActionResult> DeleteCinema(Guid id)
        {
            try
            {
                var result = await _cinemaService.deleteCinema(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
