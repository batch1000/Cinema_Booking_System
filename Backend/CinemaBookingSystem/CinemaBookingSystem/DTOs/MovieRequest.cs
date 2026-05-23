using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class MovieRequest
    {
        [Required(ErrorMessage = "Tên phim không được để trống")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Năm sản xuất không được để trống")]
        [Range(1900, 2100, ErrorMessage = "Năm sản xuất không hợp lệ")]
        public int? ProductionYear { get; set; }

        [Required(ErrorMessage = "Ngày khởi chiếu không được để trống")]
        public DateTime? ReleaseDate { get; set; }

        [Required(ErrorMessage = "Thời lượng không được để trống")]
        [Range(1, 1000, ErrorMessage = "Thời lượng phải lớn hơn 0")]
        public int? Duration { get; set; }

        [Required(ErrorMessage = "Độ tuổi không được để trống")]
        [Range(1, 30, ErrorMessage = "Độ tuổi không hợp lệ")]
        public int? AgeRating { get; set; }

        [Required(ErrorMessage = "Mô tả không được để trống")]
        public string Description { get; set; }

        public IFormFile Poster { get; set; }
        public IFormFile Trailer { get; set; }

        [Required(ErrorMessage = "Phải chọn quốc gia")]
        public Guid CountryId { get; set; }

        [Required(ErrorMessage = "Phải chọn trạng thái")]
        public Guid StatusId { get; set; }

        [Required(ErrorMessage = "Phải chọn ít nhất 1 diễn viên")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 diễn viên")]
        public List<Guid> ListActorId { get; set; }

        [Required(ErrorMessage = "Phải chọn ít nhất 1 đạo diễn")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 đạo diễn")]
        public List<Guid> ListDirectorId { get; set; }

        [Required(ErrorMessage = "Phải chọn ít nhất 1 thể loại")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 thể loại")]
        public List<Guid> ListGenreId { get; set; }

        [Required(ErrorMessage = "Phải chọn ít nhất 1 thể loại")]
        [MinLength(1, ErrorMessage = "Phải chọn ít nhất 1 thể loại")]
        public List<Guid> ListLanguageId { get; set; }

    }
}
