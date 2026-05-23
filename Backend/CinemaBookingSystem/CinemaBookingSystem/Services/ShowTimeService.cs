using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class ShowTimeService
    {
        private readonly MyDbContext _context;
        private readonly RedisService _redisService;

        public ShowTimeService(MyDbContext context, RedisService redisService)
        {
            _context = context;
            _redisService = redisService;
        }

        public async Task<bool> createShowTime(ShowTimeRequest showTimeRequest)
        {
            if (showTimeRequest.StartTime >= showTimeRequest.EndTime)
            {
                throw new BadRequestException("Thời gian bắt đầu và kết thúc không hợp lý");
            }

            if (showTimeRequest.StartTime < DateTime.Now)
            {
                throw new BadRequestException("Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại");
            }

            if (showTimeRequest.EndTime.Value.Date != showTimeRequest.StartTime.Value.Date)
            {
                throw new BadRequestException("Suất chiếu không được qua ngày");
            }

            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieID == showTimeRequest.MovieID);
            if (movie == null)
            {
                throw new BadRequestException("Không tìm thấy phim");
            }

            if (showTimeRequest.StartTime < movie.ReleaseDate)
            {
                throw new BadRequestException("Thời gian bắt đầu không được nhỏ hơn ngày ra mắt");
            }

            var overLap = await _context.ShowTimes.AnyAsync(item =>
                item.RoomID == showTimeRequest.RoomID &&
               !(showTimeRequest.EndTime <= item.StartTime || showTimeRequest.StartTime >= item.EndTime)
            );

            if (overLap)
            {
                throw new BadRequestException("Thời gian bắt đầu và kết thúc đã đụng độ với các suất chiếu khác");
            }

            await _context.ShowTimes.AddAsync(new ShowTime
            {
                ShowTimeID = Guid.NewGuid(),
                MovieID = showTimeRequest.MovieID,
                RoomID = showTimeRequest.RoomID,
                StartTime = showTimeRequest.StartTime.Value,
                EndTime = showTimeRequest.EndTime.Value,
                Price = showTimeRequest.Price.Value
            });

            var status = await _context.Statuses.FirstOrDefaultAsync(s => s.Name == "Đang chiếu");
            if(status != null)
            {
                movie.StatusID = status.StatusID;
            }

            await _context.SaveChangesAsync();

            return true;
        }


        public async Task<List<ShowTimeResponse>> getListShowTime(int page, int pageSize, FilterShowTime filterShowTime)
        {
            var query = _context.ShowTimes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterShowTime.Keyword))
            {
                query = query.Where(st => st.Movie.Title.Contains(filterShowTime.Keyword));
            }

            if (!string.IsNullOrWhiteSpace(filterShowTime.CinemaID))
            {
                if (Guid.TryParse(filterShowTime.CinemaID, out Guid cinemaId))
                {
                    query = query.Where(st => st.Room.CinemaID == cinemaId);
                }
            }

            if (filterShowTime.Date.HasValue)
            {
                query = query.Where(st => st.StartTime.Date == filterShowTime.Date.Value.Date);
            }

                var listShowTime = await query
                .OrderBy(st => st.StartTime)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(st => new ShowTimeResponse
                {
                    ShowTimeID = st.ShowTimeID,
                    StartTime = st.StartTime,
                    EndTime = st.EndTime,
                    Price = st.Price,
                    Movie = new MovieReponse
                    {
                        MovieID = st.Movie.MovieID,
                        Title = st.Movie.Title,
                        PosterUrl = st.Movie.PosterUrl,
                        Status = new
                        {
                          StatusID = st.Movie.Status.StatusID,
                          Name = st.Movie.Status.Name
                        }
                    },
                    Room = new RoomResponse
                    {
                        RoomID = st.Room.RoomID,
                        Name = st.Room.Name,
                        CinemaID = st.Room.CinemaID,
                        CinemaName = st.Room.Cinema.Name
                    }
                })
                .ToListAsync();

            return listShowTime;
        }

        public async Task<object> getPaginationInfo(int pageSize, FilterShowTime filterShowTime)
        {
            var query = _context.ShowTimes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filterShowTime.Keyword))
            {
                query = query.Where(st => st.Movie.Title.Contains(filterShowTime.Keyword));
            }

            if (!string.IsNullOrWhiteSpace(filterShowTime.CinemaID))
            {
                if (Guid.TryParse(filterShowTime.CinemaID, out Guid cinemaId))
                {
                    query = query.Where(st => st.Room.CinemaID == cinemaId);
                }
            }

            if (filterShowTime.Date.HasValue)
            {
                query = query.Where(st => st.StartTime.Date == filterShowTime.Date.Value.Date);
            }

            var totalItem = await query.CountAsync();
            var totalPage = (int)Math.Ceiling((double)totalItem / pageSize);

            return new
            {
                totalItem,
                totalPage,
            };
        }

        public async Task<bool> updateShowTime(Guid id, ShowTimeRequest showTimeRequest)
        {
            var showTime = await _context.ShowTimes.FindAsync(id);
            if (showTime == null)
            {
                throw new BadRequestException("Không tìm thấy suất chiếu này");
            }

            if (showTimeRequest.StartTime.Value >= showTimeRequest.EndTime.Value)
            {
                throw new BadRequestException("Thời gian bắt đầu và kết thúc không hợp lý");
            }

            if (showTimeRequest.StartTime.Value < DateTime.Now)
            {
                throw new BadRequestException("Thời gian bắt đầu không được nhỏ hơn thời gian hiện tại");
            }

            if (showTimeRequest.EndTime.Value.Date != showTimeRequest.StartTime.Value.Date)
            {
                throw new BadRequestException("Suất chiếu không được qua ngày");
            }

            var movie = await _context.Movies.FirstOrDefaultAsync(m => m.MovieID == showTimeRequest.MovieID);
            if (movie == null)
            {
                throw new BadRequestException("Không tìm thấy phim");
            }

            if (showTimeRequest.StartTime.Value < movie.ReleaseDate)
            {
                throw new BadRequestException("Thời gian bắt đầu không được nhỏ hơn ngày ra mắt");
            }

            var overLap = await _context.ShowTimes.AnyAsync(item =>
                item.ShowTimeID != id && 
                item.RoomID == showTimeRequest.RoomID &&
               !(showTimeRequest.EndTime <= item.StartTime || showTimeRequest.StartTime >= item.EndTime)
            );

            if (overLap)
            {
                throw new BadRequestException("Thời gian bắt đầu và kết thúc đã đụng độ với các suất chiếu khác");
            }

            showTime.StartTime = showTimeRequest.StartTime.Value;
            showTime.EndTime = showTimeRequest.EndTime.Value;
            showTime.Price = showTimeRequest.Price.Value;
            showTime.MovieID = showTimeRequest.MovieID;
            showTime.RoomID = showTimeRequest.RoomID;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> deleteShowTime(Guid id)
        {
            var showTime = await _context.ShowTimes.FindAsync(id);
            if (showTime == null)
            {
                throw new BadRequestException("Không tìm thấy suất chiếu này");
            }

            _context.ShowTimes.Remove(showTime);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ShowTimeByMovieResponse>> getListShowTimeByMovie(Guid id, FilterShowTime filter)
        {
            var key = $"getListShowTimeByMovie:{id}:{filter.Date.Value.Date:yyyy-MM-dd}";
            var cache = await _redisService.GetAsync(key);

            if (string.IsNullOrWhiteSpace(cache))
            {
                var listShowTime = await _context.Cinemas
                   .Where(c => c.Rooms
                       .SelectMany(r => r.ShowTimes)
                       .Any(st =>
                           st.MovieID == id &&
                           (!filter.Date.HasValue || st.StartTime.Date == filter.Date.Value.Date)
                        ))
                   .Select(c => new ShowTimeByMovieResponse
                   {
                       Cinema = new CinemaResponse
                       {
                           CinemaID = c.CinemaID,
                           Name = c.Name,
                           Address = c.Address
                       },
                       listShowTime = c.Rooms
                           .SelectMany(r => r.ShowTimes)
                           .Where(st => st.MovieID == id
                                   && (!filter.Date.HasValue || st.StartTime.Date == filter.Date.Value.Date)
                            )
                           .OrderBy(st => st.StartTime)
                           .Select(st => new ShowTimeResponse
                           {
                               ShowTimeID = st.ShowTimeID,
                               StartTime = st.StartTime,
                               EndTime = st.EndTime,
                               Price = st.Price,
                               Room = new RoomResponse
                               {
                                   RoomID = st.Room.RoomID,
                                   Name = st.Room.Name,
                                   Col = st.Room.Col,
                                   Row = st.Room.Row,
                                   ListSeat = st.Room.Seats
                                       .OrderBy(s => s.SeatNumber)
                                       .Select(s => new SeatResponse
                                       {
                                           SeatID = s.SeatID,
                                           SeatNumber = s.SeatNumber,
                                           SeatType = new SeatTypeResponse
                                           {
                                               SeatTypeID = s.SeatTypeID,
                                               Name = s.SeatType.Name,
                                               Color = s.SeatType.Color,
                                               PriceMultiplier = s.SeatType.PriceMultiplier,
                                               Description = s.SeatType.Description
                                           }
                                       })
                                       .ToList()
                               }
                           })
                           .ToList()
                   })
                   .ToListAsync();

                await _redisService.SetIfNotExistAsync(key, JsonSerializer.Serialize(listShowTime), TimeSpan.FromMinutes(10));

                var now = DateTime.Now;
                listShowTime.ForEach(c =>
                    c.listShowTime = c.listShowTime
                        .Where(st => st.StartTime > now)
                        .ToList()
                );

                listShowTime = listShowTime
                    .Where(c => c.listShowTime.Any())
                    .ToList();

                return listShowTime;
            }
            else
            {
                await _redisService.ExtendTimeToLiveAsync(key, TimeSpan.FromMinutes(10));
      
                var listShowTime = JsonSerializer.Deserialize<List<ShowTimeByMovieResponse>>(cache) ?? new List<ShowTimeByMovieResponse>();
                var now = DateTime.Now;
                listShowTime.ForEach(c =>
                    c.listShowTime = c.listShowTime
                        .Where(st => st.StartTime > now)
                        .ToList()
                );

                listShowTime = listShowTime
                    .Where(c => c.listShowTime.Any())
                    .ToList();

                return listShowTime;
            }
        }

        public async Task<List<GroupByShowTimeByMovieResponse>> getListGroupByShowTimeByMovie(Guid id)
        {
            return await _context.ShowTimes
                .Where(st => st.MovieID == id && st.StartTime > DateTime.Now)
                .GroupBy(st => st.StartTime.Date)
                .Select(gr => new GroupByShowTimeByMovieResponse { 
                    Date = gr.Key
                })
                .ToListAsync();
        }
    }
}
