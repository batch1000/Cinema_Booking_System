using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Payment
    {
        public Guid PaymentID { get; set; }
        public int Amount { get; set; }
        public DateTime CreateAt { get; set; }

        public Guid BookingID { get; set; }
        public Booking Booking { get; set; }
    }
}
