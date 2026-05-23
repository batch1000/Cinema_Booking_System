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
    public class DirectorController : ControllerBase
    {
        private readonly DirectorService _directorService;

        public DirectorController(DirectorService directorService)
        {
            _directorService = directorService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createDirector")]
        public async Task<IActionResult> CreateDirector(DirectorRequest directorRequest)
        {
            try
            {
                var result = await _directorService.createDirector(directorRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListDirector")]
        public async Task<IActionResult> GetListDirector()
        {
            try
            {
                var result = await _directorService.getListDirector();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateDirector/{id}")]
        public async Task<IActionResult> UpdateDirector(Guid id, DirectorRequest directorRequest)
        {
            try
            {
                var result = await _directorService.updateDirector(id, directorRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteDirector/{id}")]
        public async Task<IActionResult> DeleteDirector(Guid id)
        {
            try
            {
                var result = await _directorService.deleteDirector(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
