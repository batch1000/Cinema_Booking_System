using Microsoft.AspNetCore.Authorization;
using CinemaBookingSystem.DTOs;
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
    public class GenreController : ControllerBase
    {
        private readonly GenreService _genreService;

        public GenreController(GenreService genreService)
        {
            _genreService = genreService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createGenre")]
        public async Task<IActionResult> CreateGenre(GenreRequest genreRequest)
        {
            try
            {
                var result = await _genreService.createGenre(genreRequest);
                return Ok(result);
            }catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListGenre")]
        public async Task<IActionResult> GetListGenre()
        {
            try
            {
                var result = await _genreService.getListGenre();
                return Ok(result);
            } catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateGenre/{id}")]
        public async Task<IActionResult> UpdateGenre(Guid id, GenreRequest genreRequest)
        {
            try
            {
                var result = await _genreService.updateGenre(id, genreRequest);
                return Ok(result);
            }catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message});
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteGenre/{id}")]
        public async Task<IActionResult> DeleteGenre(Guid id)
        {
            try
            {
                var result = await _genreService.deleteGenre(id);
                return Ok(result);
            }catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
