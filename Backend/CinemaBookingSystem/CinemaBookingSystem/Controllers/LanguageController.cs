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
    public class LanguageController : ControllerBase
    {
        private readonly LanguageService _languageService;

        public LanguageController(LanguageService languageService)
        {
            _languageService = languageService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("createLanguage")]
        public async Task<IActionResult> CreateLanguage(LanguageRequest languageRequest)
        {
            try
            {
                var result = await _languageService.createLanguage(languageRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListLanguage")]
        public async Task<IActionResult> GetListLanguage()
        {
            try
            {
                var result = await _languageService.getListLanguage();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("updateLanguage/{id}")]
        public async Task<IActionResult> UpdateLanguage(Guid id, LanguageRequest languageRequest)
        {
            try
            {
                var result = await _languageService.updateLanguage(id, languageRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("deleteLanguage/{id}")]
        public async Task<IActionResult> DeleteLanguage(Guid id)
        {
            try
            {
                var result = await _languageService.deleteLanguage(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
