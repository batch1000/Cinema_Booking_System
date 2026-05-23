using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class SeatResponse
    {
        public Guid SeatID { get; set; }
        public string SeatNumber { get; set; }
        
        public SeatTypeResponse SeatType { get; set; }
    }
}
