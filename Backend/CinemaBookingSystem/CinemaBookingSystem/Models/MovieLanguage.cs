using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class MovieLanguage
    {
        public Guid LanguageID { get; set; }
        public Guid MovieID { get; set; }

        public Movie Movie { get; set; }
        public Language Language { get; set; }
    }
}
