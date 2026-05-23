using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Models
{
    public class Language
    {
        public Guid LanguageID { get; set; }
        public string Name { get; set; }

        public ICollection<MovieLanguage> MovieLanguages { get; set; }
    }
}
