using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class FilterMovie
    {
        public string Genre { get; set; }
        public string GenreName { get; set; }
        public string Status { get; set; }
        public string Country { get; set; }
        public string CountryId { get; set; }
        public string CinemaId { get; set; }
        public string ShowTimeId { get; set; }
        public string Keyword { get; set; }
        public DateTime? DateFilter { get; set; }
        public int Age { get; set; }
    }
}
