using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class SeatHoldingRequest
    {
        [Required(ErrorMessage = "SeatID không được để trống")]
        public Guid SeatID { get; set; }

        [Required(ErrorMessage = "ShowTimeID không được để trống")]
        public Guid ShowTimeID { get; set; }

        [Required(ErrorMessage = "UserID không được để trống")]
        public Guid UserID { get; set; }
    }
}
