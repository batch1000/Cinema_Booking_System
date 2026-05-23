using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class MovieApiRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string PosterUrl { get; set; }
        public string TrailerUrl { get; set; }
        public string BannerUrl { get; set; }
        public int AgeRating { get; set; }
        public int ProductionYear { get; set; }

        public string Country { get; set; }

        public List<string> ListActor { get; set; }
        public List<string> ListDirector { get; set; }
        public List<string> ListGenre { get; set;  }
        public List<string> ListLanguage { get; set; }
    }
}
