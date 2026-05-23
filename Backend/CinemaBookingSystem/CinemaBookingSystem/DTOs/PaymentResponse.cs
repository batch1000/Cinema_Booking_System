using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class PaymentResponse
    {
        public Guid PaymentID { get; set; }
        public int Amount { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
