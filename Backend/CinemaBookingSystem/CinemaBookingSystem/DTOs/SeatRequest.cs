using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class SeatTypeOfSeatRequest
    {
        [Required(ErrorMessage = "SeatTypeID không được để trống")]
        public Guid SeatTypeID { get; set; }

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

    public class SeatRequest
    {
        [Required(ErrorMessage = "SeatID không được để trống")]
        public Guid SeatID { get; set; }

        [Required(ErrorMessage = "Tên ghế không được để trống")]
        public string SeatNumber { get; set; }

        [Required(ErrorMessage = "Loại ghế không được để trống")]
        public SeatTypeOfSeatRequest SeatType { get; set; }
    }
}
