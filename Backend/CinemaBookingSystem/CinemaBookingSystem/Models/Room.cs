using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Room
    {
        public Guid RoomID { get; set; }
        public string Name { get; set; }
        public int Col { get; set; }
        public int Row { get; set; }

        public Guid CinemaID { get; set; }
        public Cinema Cinema { get; set; }

        public ICollection<Seat> Seats { get; set; }
        public ICollection<ShowTime> ShowTimes { get; set; }
    }
}
