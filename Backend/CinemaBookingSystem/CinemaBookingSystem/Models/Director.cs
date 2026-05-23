using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Director
    {
        public Guid DirectorID { get; set; }
        public string Name { get; set; }

        public ICollection<MovieDirector> MovieDirectors { get; set; }
    }
}
