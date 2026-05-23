using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class SeatHoldingResponse
    {
        public Guid UserID { get; set; }
        public Guid SeatID { get; set; }
        public Guid ShowTimeID { get; set; }
        public DateTime ExpireTime { get; set; }
    }
}
