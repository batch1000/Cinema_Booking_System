using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly MovieService _movieService;

        public MovieController(MovieService movieService)
        {
            _movieService = movieService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createMovie")]
        public async Task<IActionResult> CreateMovie([FromForm] MovieRequest movieRequest)
        {
            try
            {
                if (movieRequest.ReleaseDate < DateTime.Today)
                {
                    return BadRequest(new { message = "Ngày khởi chiếu không được nhỏ hơn hôm nay" });
                }

                if(movieRequest.Poster == null)
                {
                    return BadRequest(new { message = "Poster không được để trống" });
                }

                if(movieRequest.Poster.Length > 5 * 1024 *1024)
                {
                    return BadRequest(new { message = "Poster không được vượt quá 5MB"});
                }

                if(movieRequest.Trailer == null)
                {
                    return BadRequest(new { message = "Trailer không được để trống" });
                }

                if (movieRequest.Trailer.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Trailer không được vượt quá 10MB" });
                }

                var result = await _movieService.createMovie(movieRequest);
                return Ok(result);
            } catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            } catch (Exception ex){
                return StatusCode(500, new { message = ex.Message});
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("updateMovie/{id}")]
        public async Task<IActionResult> UpdateMovie(Guid id, [FromForm]MovieRequest movieRequest)
        {
            try
            {
                if (movieRequest.Poster != null && movieRequest.Poster.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Poster không được vượt quá 5MB" });
                }

                if (movieRequest.Trailer != null && movieRequest.Trailer.Length > 10 * 1024 * 1024)
                {
                    return BadRequest(new { message = "Trailer không được vượt quá 10MB" });
                }

                var result = await _movieService.updateMovie(id, movieRequest);
                return Ok(result);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getListMovie")]
        public async Task<IActionResult> GetListMovie(int page, int pageSize, [FromQuery]FilterMovie filterMovie)
        {
            try
            {
                var result = await _movieService.getListMovie(page, pageSize, filterMovie);
                return Ok(result);
            } catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getListMovieBanner")]
        public async Task<IActionResult> GetListMovieBanner(int page, int pageSize, [FromQuery] FilterMovie filterMovie)
        {
            try
            {
                var result = await _movieService.getListMovieBanner(page, pageSize, filterMovie);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getListMovieByCountry")]
        public async Task<IActionResult> GetListMovieByCountry(int page, int pageSize, [FromQuery] FilterMovie filterMovie)
        {
            try
            {
                var result = await _movieService.getListMovieByCountry(page, pageSize, filterMovie);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getListMovieByGenre")]
        public async Task<IActionResult> GetListMovieByGenre(int page, int pageSize, [FromQuery] FilterMovie filterMovie)
        {
            try
            {
                var result = await _movieService.getListMovieByGenre(page, pageSize, filterMovie);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getAllListMovie")]
        public async Task<IActionResult> GetAllListMovie()
        {
            try
            {
                var result = await _movieService.getAllListMovie();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getMovieById/{id}")]
        public async Task<IActionResult> GetMovieById(Guid id)
        {
            try
            {
                var result = await _movieService.getMovieById(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("getMovieInfoPagination")]
        public async Task<IActionResult> GetTotalPage(int pageSize, [FromQuery] FilterMovie filterMovie)
        {
            try
            {
                var result = await _movieService.getTotalPage(pageSize, filterMovie);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteMovie/{id}")]
        public async Task<IActionResult> DeleteMovie(Guid id)
        {
            try
            {
                var result = await _movieService.deleteMovie(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("importMovieApi")]
        public async Task<IActionResult> ImportMovieApi(List<MovieApiRequest> listMovie)
        {
            try
            {
                var result = await _movieService.importMovieApi(listMovie);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
