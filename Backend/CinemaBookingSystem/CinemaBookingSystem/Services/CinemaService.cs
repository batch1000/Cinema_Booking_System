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
    public class CinemaService
    {
        private readonly MyDbContext _context;

        public CinemaService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Cinema> createCinema(CinemaRequest cinemaRequest)
        {
            var cinema = new Cinema
            {
                CinemaID = Guid.NewGuid(),
                Name = cinemaRequest.Name,
                Address = cinemaRequest.Address
            };

            await _context.Cinemas.AddAsync(cinema);
            await _context.SaveChangesAsync();

            return cinema;
        }

        public async Task<List<CinemaResponse>> getListCinema(int page, int pageSize, FilterCinema filterCinema)
        {
            var listGroupSeatType = await _context.Seats
                .GroupBy(s => new { s.RoomID, s.SeatTypeID, s.SeatType.Name, s.SeatType.Color })
                .Select(gr => new GroupSeatType
                {
                    RoomID = gr.Key.RoomID,
                    SeatTypeID = gr.Key.SeatTypeID,
                    Name = gr.Key.Name,
                    Color = gr.Key.Color,
                    Total = gr.Count()
                })
                .ToListAsync();

            var query = _context.Cinemas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterCinema.Keyword))
            {
                query = query.Where(c => c.Name.Contains(filterCinema.Keyword));
            }

            var listCinema =  await query
                .OrderBy(m => m.Name)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new CinemaResponse
                {
                    CinemaID = c.CinemaID,
                    Name = c.Name,
                    Address = c.Address,
                    RoomCount = c.Rooms.Count,
                    ListRoom = c.Rooms
                    .OrderBy(r => r.Name)
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
                    .ToList()
                })     
                .ToListAsync();

            foreach(var cinema in listCinema)
            {
                foreach(var room in cinema.ListRoom)
                {
                    room.ListGroupSeatType = listGroupSeatType
                        .Where(e => e.RoomID == room.RoomID)
                        .Select(e => new GroupSeatTypeResponse { 
                            SeatTypeID = e.SeatTypeID,
                            Name = e.Name,
                            Color = e.Color,
                            Total = e.Total
                        })
                        .ToList();
                }
            }
            return listCinema;
        }

        public async Task<List<CinemaResponse>> getAllListCinema()
        {
            var listGroupSeatType = await _context.Seats
                .GroupBy(s => new { s.RoomID, s.SeatTypeID, s.SeatType.Name, s.SeatType.Color })
                .Select(gr => new GroupSeatType
                {
                    RoomID = gr.Key.RoomID,
                    SeatTypeID = gr.Key.SeatTypeID,
                    Name = gr.Key.Name,
                    Color = gr.Key.Color,
                    Total = gr.Count()
                })
                .ToListAsync();

            var query = _context.Cinemas.AsQueryable();

            var listCinema = await query
                .OrderBy(m => m.Name)
                .Select(c => new CinemaResponse
                {
                    CinemaID = c.CinemaID,
                    Name = c.Name,
                    Address = c.Address,
                    RoomCount = c.Rooms.Count,
                    ListRoom = c.Rooms
                    .OrderBy(r => r.Name)
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
                    .ToList()
                })
                .ToListAsync();

            foreach (var cinema in listCinema)
            {
                foreach (var room in cinema.ListRoom)
                {
                    room.ListGroupSeatType = listGroupSeatType
                        .Where(e => e.RoomID == room.RoomID)
                        .Select(e => new GroupSeatTypeResponse
                        {
                            SeatTypeID = e.SeatTypeID,
                            Name = e.Name,
                            Color = e.Color,
                            Total = e.Total
                        })
                        .ToList();
                }
            }
            return listCinema;
        }

        public async Task<List<CinemaShowTimeResponse>> getAllListCinemaShowTime()
        {
            return await _context.Cinemas
                .Select(c => new CinemaShowTimeResponse { 
                    CinemaID = c.CinemaID,
                    Name = c.Name,
                    ListShowTime = c.Rooms
                        .SelectMany(r => r.ShowTimes)
                        .OrderBy(st => st.StartTime)
                        .Where(st => st.StartTime > DateTime.Now)
                        .Select(st => new ShowTimeResponse
                        {
                            ShowTimeID = st.ShowTimeID,
                            StartTime = st.StartTime,
                            EndTime = st.EndTime
                        })
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<object> getPaginationInfo(int pageSize, FilterCinema filterCinema)
        {
            var query = _context.Cinemas.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterCinema.Keyword))
            {
                query = query.Where(c => c.Name.Contains(filterCinema.Keyword));
            }

            var totalCinema = await query.CountAsync();
            var totalPage = (int)Math.Ceiling((double)totalCinema / pageSize);

            var totalRoom = await query
                .SelectMany(c => c.Rooms).CountAsync();

            var totalSeat = await query
                .SelectMany(c => c.Rooms)
                .SelectMany(r => r.Seats)
                .CountAsync();

            var totalSeatType = await query
                .SelectMany(c => c.Rooms)
                .SelectMany(r => r.Seats)
                .Select(s => s.SeatTypeID)
                .Distinct()
                .CountAsync();

            return new
            {
                totalCinema,
                totalPage,
                totalRoom,
                totalSeat,
                totalSeatType
            };
        }

        public async Task<Cinema> updateCinema(Guid id, CinemaRequest cinemaRequest)
        {
            var cinema = await _context.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                throw new BadRequestException("Không tìm thấy rạp phim này");
            }

            cinema.Name = cinemaRequest.Name;
            cinema.Address = cinemaRequest.Address;

            await _context.SaveChangesAsync();

            return cinema;
        }

        public async Task<bool> deleteCinema(Guid id)
        {
            var cinema = await _context.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                throw new BadRequestException("Không tìm thấy rạp phim này");
            }

            _context.Cinemas.Remove(cinema);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
