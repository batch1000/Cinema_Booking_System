using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.DTOs
{
    public class RoomResponse
    {
        public Guid RoomID { get; set; }
        public string Name { get; set; }
        public int Col { get; set; }
        public int Row { get; set; }

        public List<SeatResponse> ListSeat { get; set; }
        public int SeatCount { get; set; }

        public List<GroupSeatTypeResponse> ListGroupSeatType { get; set; }

        public Guid? CinemaID { get; set; }
        public string CinemaName { get; set; }

        public CinemaResponse Cinema { get; set; }
    }
}
