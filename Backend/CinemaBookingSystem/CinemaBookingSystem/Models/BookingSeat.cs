using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class BookingSeat
    {
        public Guid BookingSeatID { get; set; }

        public Guid BookingID { get; set; }
        public Booking Booking { get; set; }

        public Guid SeatID { get; set; }
        public Seat Seat { get; set; }
    }
}
