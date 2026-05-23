using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Actor
    {
        public Guid ActorID { get; set; }
        public string Name { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }
    }
}
