using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class UpdateRoomRequest
    {
        [Required(ErrorMessage = "Tên phòng không được để trống")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Số cột của ghế không được để trống")]
        [Range(1, 25, ErrorMessage = "Số cột phải từ 1 đến 25")]
        public int Col { get; set; }

        [Required(ErrorMessage = "Số hàng ghế không được để trống")]
        [Range(1, 26, ErrorMessage = "Số hàng phải từ 1 đến 26 (giới hạn A–Z)")]
        public int Row { get; set; }
    }
}
