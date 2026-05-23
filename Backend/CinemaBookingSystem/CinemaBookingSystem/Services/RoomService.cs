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
    public class RoomService
    {
        private readonly MyDbContext _context;
        private readonly SeatService _seatService;

        public RoomService(MyDbContext context, SeatService seatService)
        {
            _context = context;
            _seatService = seatService;
        }

        public async Task<RoomResponse> createRoom(RoomRequest roomRequest)
        {
            var room = new Room
            {
                RoomID = Guid.NewGuid(),
                Name = roomRequest.Name,
                Col = roomRequest.Col,
                Row = roomRequest.Row,
                CinemaID = roomRequest.CinemaID
            };

            await _context.Rooms.AddAsync(room);

            await _seatService.createSeat(room.RoomID, roomRequest.Col, roomRequest.Row);

            await _context.SaveChangesAsync();

            var listGroupSeatType = await _context.Seats
               .GroupBy(s => new { s.RoomID, s.SeatTypeID, s.SeatType.Name })
               .Select(gr => new GroupSeatType
               {
                   RoomID = gr.Key.RoomID,
                   SeatTypeID = gr.Key.SeatTypeID,
                   Name = gr.Key.Name,
                   Total = gr.Count()
               })
               .ToListAsync();

            var roomReponse = await _context.Rooms
                .Where(r => r.RoomID == room.RoomID)
                .Select(r => new RoomResponse
                {
                    RoomID = r.RoomID,
                    Name = r.Name,
                    Col = r.Col,
                    Row = r.Row,
                    SeatCount = r.Seats.Count,
                    ListSeat = r.Seats
                        .OrderBy(s => s.SeatNumber)
                        .Select(s => new SeatResponse
                        {
                            SeatID = s.SeatID,
                            SeatNumber = s.SeatNumber,
                            SeatType = new SeatTypeResponse
                            {
                                SeatTypeID = s.SeatType.SeatTypeID,
                                Name = s.SeatType.Name,
                                PriceMultiplier = s.SeatType.PriceMultiplier,
                                Description = s.SeatType.Description,
                                Color = s.SeatType.Color
                            }
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            roomReponse.ListGroupSeatType = listGroupSeatType
                        .Where(e => e.RoomID == roomReponse.RoomID)
                        .Select(e => new GroupSeatTypeResponse
                        {
                            SeatTypeID = e.SeatTypeID,
                            Name = e.Name,
                            Total = e.Total
                        })
                        .ToList();
            return roomReponse;
        }

        public async Task<bool> deleteRoom(Guid id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                throw new BadRequestException("Không tìm thấy phòng này");
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<RoomResponse> updateRoom(Guid id, UpdateRoomRequest roomRequest)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                throw new BadRequestException("Không tìm thấy phòng này");
            }

            room.Name = roomRequest.Name;

            if(room.Col != roomRequest.Col || room.Row != roomRequest.Row)
            {
                room.Col = roomRequest.Col;
                room.Row = roomRequest.Row;

                var listSeatOld = await _context.Seats
                    .Where(s => s.RoomID == room.RoomID)
                    .ToListAsync();

                _context.Seats.RemoveRange(listSeatOld);

                await _seatService.createSeat(room.RoomID, room.Col, room.Row);
            }

            await _context.SaveChangesAsync();

            var listGroupSeatType = await _context.Seats
              .GroupBy(s => new { s.RoomID, s.SeatTypeID, s.SeatType.Name })
              .Select(gr => new GroupSeatType
              {
                  RoomID = gr.Key.RoomID,
                  SeatTypeID = gr.Key.SeatTypeID,
                  Name = gr.Key.Name,
                  Total = gr.Count()
              })
              .ToListAsync();

            var roomReponse = await _context.Rooms
               .Where(r => r.RoomID == room.RoomID)
               .Select(r => new RoomResponse
               {
                   RoomID = r.RoomID,
                   Name = r.Name,
                   Col = r.Col,
                   Row = r.Row,
                   SeatCount = r.Seats.Count,
                   ListSeat = r.Seats
                       .Select(s => new SeatResponse
                       {
                           SeatID = s.SeatID,
                           SeatNumber = s.SeatNumber,
                           SeatType = new SeatTypeResponse
                           {
                               SeatTypeID = s.SeatType.SeatTypeID,
                               Name = s.SeatType.Name,
                               PriceMultiplier = s.SeatType.PriceMultiplier,
                               Description = s.SeatType.Description,
                               Color = s.SeatType.Color
                           }
                       })
                       .ToList()
               })
               .FirstOrDefaultAsync();

            roomReponse.ListGroupSeatType = listGroupSeatType
                        .Where(e => e.RoomID == roomReponse.RoomID)
                        .Select(e => new GroupSeatTypeResponse
                        {
                            SeatTypeID = e.SeatTypeID,
                            Name = e.Name,
                            Total = e.Total
                        })
                        .ToList();
            return roomReponse;
        }
    }
}
