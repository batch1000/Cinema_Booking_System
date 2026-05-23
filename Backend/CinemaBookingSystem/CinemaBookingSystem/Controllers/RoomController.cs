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
    public class RoomController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createRoom")]
        public async Task<IActionResult> CreateRoom(RoomRequest roomRequest)
        {
            try
            {
                var result = await _roomService.createRoom(roomRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteRoom/{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            try
            {
                var result = await _roomService.deleteRoom(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateRoom/{id}")]
        public async Task<IActionResult> UpdateRoom(Guid id, UpdateRoomRequest roomRequest)
        {
            try
            {
                var result = await _roomService.updateRoom(id, roomRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
