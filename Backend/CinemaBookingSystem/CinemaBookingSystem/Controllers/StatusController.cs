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
    public class StatusController : ControllerBase
    {
        private readonly StatusService _statusService;

        public StatusController(StatusService statusService)
        {
            _statusService = statusService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createStatus")]
        public async Task<IActionResult> CreateStatus(StatusRequest statusRequest)
        {
            try
            {
                var result = await _statusService.createStatus(statusRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListStatus")]
        public async Task<IActionResult> GetListStatus()
        {
            try
            {
                var result = await _statusService.getListStatus();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, StatusRequest statusRequest)
        {
            try
            {
                var result = await _statusService.updateStatus(id, statusRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteStatus/{id}")]
        public async Task<IActionResult> DeleteStatus(Guid id)
        {
            try
            {
                var result = await _statusService.deleteStatus(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
