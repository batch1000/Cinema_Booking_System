using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Booking
    {
        public Guid BookingID { get; set; }
        public int TotalPrice { get; set; }
        public DateTime CreateAt { get; set; }

        public Guid UserID { get; set; }
        public User User { get; set; }

        public Guid ShowTimeID { get; set; }
        public ShowTime ShowTime { get; set; }

        public ICollection<BookingSeat> BookingSeats { get; set; }

        public Payment Payment { get; set; }
    }
}
