using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class MovieDirector
    {
        public Guid MovieID { get; set; }
        public Guid DirectorID { get; set; }

        public Movie Movie { get; set; }
        public Director Director { get; set; }
    }
}
