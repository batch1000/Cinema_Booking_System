using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class FilterShowTime
    {
        public string Keyword { get; set; }
        public string CinemaID { get; set; }
        public DateTime? Date { get; set; }
    }
}
