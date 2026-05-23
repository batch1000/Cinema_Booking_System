using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class MovieActor
    {
        public Guid ActorID { get; set; }
        public Guid MovieID { get; set; }

        public Actor Actor { get; set; }
        public Movie Movie { get; set; }
    }
}
