using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class BookingSeatResponse
    {
        public Guid BookingSeatID { get; set; }
        public SeatResponse Seat { get; set; }
    }
}
