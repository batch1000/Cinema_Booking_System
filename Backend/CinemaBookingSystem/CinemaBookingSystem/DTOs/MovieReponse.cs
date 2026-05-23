using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class MovieReponse
    {
        public Guid MovieID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public string ReleaseDate { get; set; }
        public string PosterUrl { get; set; }
        public string TrailerUrl { get; set; }
        public string BannerUrl { get; set; }
        public int AgeRating { get; set; }
        public int ProductionYear { get; set; }

        public object Country { get; set; }
        public object Status { get; set; }

        public List<object> ListGenre { get; set; }
        public List<object> ListDirector { get; set; }
        public List<object> ListActor { get; set; }
        public List<object> ListLanguage { get; set; }

        public int TotalPage { get; set; }
    }
}
