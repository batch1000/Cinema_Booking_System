using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class ShowTimeByMovieResponse
    {
        public CinemaResponse Cinema { get; set; }

        public List<ShowTimeResponse> listShowTime {get; set; }
    }
}
