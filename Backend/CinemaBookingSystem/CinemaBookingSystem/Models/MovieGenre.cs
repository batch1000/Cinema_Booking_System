using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class MovieGenre
    {
        public Guid MovieID { get; set; }
        public Guid GenreID { get; set; }

        public Movie Movie { get; set; }
        public Genre Genre { get; set; }
    }
}
