using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Movie
    {
        public Guid MovieID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string PosterUrl { get; set; }
        public string TrailerUrl { get; set; }
        public string BannerUrl { get; set; }
        public int AgeRating { get; set; }
        public int ProductionYear { get; set; }
        public Guid StatusID { get; set; }
        public Guid CountryID { get; set; }

        public ICollection<MovieGenre> MovieGenres { get; set; }
        public ICollection<MovieDirector> MovieDirectors { get; set; }
        public ICollection<MovieActor> MovieActors { get; set; }
        public ICollection<MovieLanguage> MovieLanguages { get; set; }
        public Status Status { get; set; }
        public Country Country { get; set; }

        public ICollection<ShowTime> ShowTimes { get; set; }
    }
}
