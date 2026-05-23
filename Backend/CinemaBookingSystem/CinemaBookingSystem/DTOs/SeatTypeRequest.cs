using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class SeatTypeRequest
    {
        [Required(ErrorMessage = "Tên loại ghế không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Hệ số không được để trống")]
        [Range(0, 10, ErrorMessage = "Hệ số không hợp lệ")]
        public float? PriceMultiplier { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Màu sắc không được để trống")]
        public string Color { get; set; }
    }
}
