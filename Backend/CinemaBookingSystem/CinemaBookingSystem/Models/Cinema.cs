using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Cinema
    {
        public Guid CinemaID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public ICollection<Room> Rooms { get; set; }
    }
}
