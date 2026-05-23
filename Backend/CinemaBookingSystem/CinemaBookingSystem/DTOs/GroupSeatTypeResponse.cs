using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class GroupSeatTypeResponse
    {
        public Guid SeatTypeID { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public int Total { get; set; }
    }
}
