using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class SeatType
    {
        public Guid SeatTypeID { get; set; }
        public string Name { get; set; }
        public float PriceMultiplier { get; set; }
        public string Description { get; set; }
        public string Color { get; set; }

        public ICollection<Seat> Seats { get; set; }
    }
}
