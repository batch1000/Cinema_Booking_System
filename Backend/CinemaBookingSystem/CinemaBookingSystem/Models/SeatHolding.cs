using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class SeatHolding
    {
        public Guid SeatHoldingID { get; set; }

        public Guid UserID { get; set; }
        public User User { get; set; }

        public Guid ShowTimeID { get; set; }
        public ShowTime ShowTime { get; set; }

        public Guid SeatID { get; set; }
        public Seat Seat { get; set; }

        public DateTime ExpireTime { get; set; }
    }
}
