using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class CinemaShowTimeResponse
    {
        public Guid CinemaID { get; set; }
        public string Name { get; set; }

        public List<ShowTimeResponse> ListShowTime { get; set; }
    }
}
