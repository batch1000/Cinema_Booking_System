using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class ConfirmPaymentRequest
    {
        [Required(ErrorMessage = "PaymentIntentId không được để trống")]
        public string PaymentIntentId { get; set; }

        [Required(ErrorMessage = "BookingDraftID không được để trống")]
        public Guid BookingDraftID { get; set; }

        [Required(ErrorMessage = "ShowTimeID không được để trống")]
        public Guid ShowTimeID { get; set; }

        [Required(ErrorMessage = "UserID không được để trống")]
        public Guid UserID { get; set; }
    }
}
