using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class ShowTimeResponse
    {
        public Guid ShowTimeID { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Price { get; set; }

        public MovieReponse Movie { get; set; }
        public RoomResponse Room { get; set; }
    }
}
