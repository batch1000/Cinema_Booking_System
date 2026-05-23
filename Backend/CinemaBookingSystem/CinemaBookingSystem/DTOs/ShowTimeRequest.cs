using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class ShowTimeRequest
    {
        [Required(ErrorMessage = "Phim không được để trống")]
        public Guid MovieID { get; set; }

        [Required(ErrorMessage = "Phòng không được để trống")]
        public Guid RoomID { get; set; }

        [Required(ErrorMessage = "Thời gian bắt đầu không được để trống")]
        public DateTime? StartTime { get; set; }

        [Required(ErrorMessage = "Thời gian kết thúc không được để trống")]
        public DateTime? EndTime { get; set; }

        [Required(ErrorMessage = "Giá vé không được để trống")]
        [Range(1, int.MaxValue, ErrorMessage = "Giá vé phải lớn hơn 0")]
        public int? Price { get; set; }
    }
}
