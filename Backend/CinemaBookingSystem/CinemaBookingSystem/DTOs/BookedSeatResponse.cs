using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class BookedSeatResponse
    {
        public Guid SeatID { get; set; }
        public Guid UserID { get; set; }
    }
}
