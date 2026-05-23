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
    public class CountryController : ControllerBase
    {
        private readonly CountryService _countryService;

        public CountryController(CountryService countryService)
        {
            _countryService = countryService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createCountry")]
        public async Task<IActionResult> CreateCountry(CountryRequest countryRequest)
        {
            try
            {
                var result = await _countryService.createCountry(countryRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListCountry")]
        public async Task<IActionResult> GetListCountry()
        {
            try
            {
                var result = await _countryService.getListCountry();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateCountry/{id}")]
        public async Task<IActionResult> UpdateCountry(Guid id, CountryRequest countryRequest)
        {
            try
            {
                var result = await _countryService.updateCountry(id, countryRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteCountry/{id}")]
        public async Task<IActionResult> DeleteCountry(Guid id)
        {
            try
            {
                var result = await _countryService.deleteCountry(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
