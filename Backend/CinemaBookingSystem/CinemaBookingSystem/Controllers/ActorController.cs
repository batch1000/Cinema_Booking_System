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
    public class ActorController : ControllerBase
    {
        private readonly ActorService _actorService;

        public ActorController(ActorService actorService)
        {
            _actorService = actorService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createActor")]
        public async Task<IActionResult> CreateActor(ActorRequest actorRequest)
        {
            try
            {
                var result = await _actorService.createActor(actorRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListActor")]
        public async Task<IActionResult> GetListActor()
        {
            try
            {
                var result = await _actorService.getListActor();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateActor/{id}")]
        public async Task<IActionResult> UpdateActor(Guid id, ActorRequest actorRequest)
        {
            try
            {
                var result = await _actorService.updateActor(id, actorRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteActor/{id}")]
        public async Task<IActionResult> DeleteActor(Guid id)
        {
            try
            {
                var result = await _actorService.deleteActor(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
