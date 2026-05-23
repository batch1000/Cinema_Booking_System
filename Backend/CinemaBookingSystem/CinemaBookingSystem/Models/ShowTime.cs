using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class ShowTime
    {
        public Guid ShowTimeID { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Price { get; set; }

        public Guid MovieID { get; set; }
        public Movie Movie { get; set; }

        public Guid RoomID { get; set; }
        public Room Room { get; set; }

        public ICollection<Booking> Bookings { get; set; }
        public ICollection<SeatHolding> SeatHoldings { get; set; }
    }
}
