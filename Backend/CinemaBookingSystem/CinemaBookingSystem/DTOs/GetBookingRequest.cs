using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingSystem.DTOs
{
    public class GetBookingRequest
    {
        [Required(ErrorMessage = "ShowTimeID không được để trống")]
        public Guid ShowTimeID { get; set; }

        [Required(ErrorMessage = "BookingDraftID không được để trống")]
        public Guid BookingDraftID { get; set; }

        [Required(ErrorMessage = "UserID không được để trống")]
        public Guid UserID { get; set; }
    }
}
