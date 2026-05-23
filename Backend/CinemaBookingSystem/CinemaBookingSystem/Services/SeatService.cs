using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class SeatService
    {
        private readonly MyDbContext _context;

        public SeatService(MyDbContext context)
        {
            _context = context;
        }

        public async Task createSeat(Guid RoomID, int Col, int Row)
        {
            var seatType = _context.SeatTypes.FirstOrDefault(st => st.Name == "Standard");
            if(seatType == null)
            {
                throw new BadRequestException("Không tìm thấy loại ghế Standard");
            }

            char letter = (char)('A' - 1);
            List<Seat> listSeat = new List<Seat>();

            for (int i = 0; i < Row; i++)
            {
                letter = (char)(letter + 1);
                for(int j = 1; j <= Col; j++)
                {
                    string seatNumber = letter.ToString() + j.ToString();
                    listSeat.Add(new Seat
                    {
                        SeatID = Guid.NewGuid(),
                        SeatNumber = seatNumber,
                        RoomID = RoomID,
                        SeatTypeID = seatType.SeatTypeID
                    });
                }
            }

            await _context.Seats.AddRangeAsync(listSeat);
        }

        public async Task<bool> updateListSeat(List<SeatRequest> listSeatRequest)
        {
            var seatIds = listSeatRequest.Select(s => s.SeatID).ToList();

            var listSeatOld = await _context.Seats
                            .Where(s => seatIds.Contains(s.SeatID))
                            .ToListAsync();
                
            for(int i = 0; i < listSeatRequest.Count; i++)
            {
                var seat = listSeatOld.Find(s => s.SeatID == listSeatRequest[i].SeatID);

                if(seat != null)
                {
                    seat.SeatTypeID = listSeatRequest[i].SeatType.SeatTypeID;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
