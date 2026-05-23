using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class CinemaResponse
    {
        public Guid CinemaID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }

        public List<RoomResponse> ListRoom { get; set; }
        public int RoomCount { get; set; }
    }
}
