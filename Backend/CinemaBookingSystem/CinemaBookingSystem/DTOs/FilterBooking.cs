using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class FilterBooking
    {
        public string? Keyword { get; set; }
        public DateTime? Date { get; set; }
        public string? UserID { get; set; }
    }
}
