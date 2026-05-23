using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class BookingRequest
    {
        [Required(ErrorMessage = "UserID không được để trống")]
        public Guid UserID { get; set; }

        [Required(ErrorMessage = "RoomID không được để trống")]
        public Guid ShowTimeID { get; set; }

        [Required(ErrorMessage = "Phải chọn ít nhất 1 ghế")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 ghế")]
        public List<Guid> ListSelectSeatID { get; set; }
    }
}
