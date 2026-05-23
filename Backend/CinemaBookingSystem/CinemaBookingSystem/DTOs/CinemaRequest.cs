using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class CinemaRequest
    {
        [Required(ErrorMessage = "Tên rạp phim không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Địa chỉ rạp phim không được để trống")]
        public string Address { get; set; }
    }
}
