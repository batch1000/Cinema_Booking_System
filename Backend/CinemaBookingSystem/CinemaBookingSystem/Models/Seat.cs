using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Seat
    {
        public Guid SeatID { get; set; }
        public string SeatNumber { get; set; }

        public Guid SeatTypeID { get; set; }
        public SeatType SeatType { get; set; }

        public Guid RoomID { get; set; }
        public Room Room { get; set; }

        public ICollection<BookingSeat> BookingSeats { get; set; }
        public ICollection<SeatHolding> SeatHoldings { get; set; }
    }
}
