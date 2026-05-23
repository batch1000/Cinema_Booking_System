using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class BookedResponse
    {
        public Guid BookingID { get; set; }
        public int TotalPrice { get; set; }
        public DateTime CreateAt { get; set; }

        public UserResponse User { get; set; }
        public ShowTimeResponse ShowTime { get; set; }
        
        public List<BookingSeatResponse> BookingSeats { get; set; }

        public PaymentResponse Payment { get; set; }
    }
}
