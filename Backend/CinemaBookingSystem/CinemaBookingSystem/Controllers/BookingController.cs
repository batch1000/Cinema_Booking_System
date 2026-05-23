using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [Authorize(Roles = "User")]
        [HttpPost("createBookingDraft")]
        public async Task<IActionResult> CreateBookingDraft(BookingRequest request)
        {
            try
            {
                var result = await _bookingService.createBookingDraft(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpGet("getBookingDraft")]
        public async Task<IActionResult> GetBookingDraft([FromQuery]GetBookingRequest request)
        {
            try
            {
                var result = await _bookingService.getBookingDraft(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpDelete("deleteBookingDraft/{bookingDraftID}/{showTimeID}/{userID}")]
        public async Task<IActionResult> DeleteBookingDraft(Guid bookingDraftID, Guid showTimeID, Guid userID)
        {
            Console.WriteLine("Call delete");
            try
            {
                var request = new GetBookingRequest { 
                    UserID = userID,
                    ShowTimeID = showTimeID,
                    BookingDraftID = bookingDraftID
                };

                var result = await _bookingService.deleteBookingDraft(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpPost("createPaymentIntent")]
        public async Task<IActionResult> CreatePaymentIntent(PaymentIntentRequest request)
        {
            try
            {
                var result = await _bookingService.createPaymentIntent(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "User")]
        [HttpPost("checkBookingDraftExist")]
        public async Task<IActionResult> CheckBookingDraftExist([FromBody]BookingDraftExistRequest request)
        {
            try
            {
                var result = await _bookingService.checkBookingDraftExist(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("confirmPayment")]
        public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
        {
            try
            {
                var result = await _bookingService.confirmPayment(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("refreshTimeToLiveBooking")]
        public async Task<IActionResult> refreshTimeToLiveBooking(GetBookingRequest request)
        {
            try
            {
                var result = await _bookingService.refreshTimeToLiveBooking(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("getListBooking")]
        public async Task<IActionResult> GetListBooking(int page, int pageSize, [FromQuery] FilterBooking filter)
        {
            try
            {
                var result = await _bookingService.getListBooking(page, pageSize, filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet("getPaginationInfo")]
        public async Task<IActionResult> GetPaginationInfo(int pageSize, [FromQuery] FilterBooking filter)
        {
            try
            {
                var result = await _bookingService.getPaginationInfo(pageSize, filter);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("getListBookedSeat/{showTimeID}")]
        public async Task<IActionResult> GetListBookedSeat(Guid showTimeID)
        {
            try
            {
                var result = await _bookingService.getListBookedSeat(showTimeID);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
