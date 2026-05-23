using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class BookingResponse
    {
        public ShowTimeResponse ShowTime { get; set; }
        public DateTime ExpireTime { get; set; }
    }
}
