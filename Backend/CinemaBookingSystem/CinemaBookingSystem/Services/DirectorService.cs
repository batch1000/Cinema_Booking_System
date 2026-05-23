using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class DirectorService
    {
        private readonly MyDbContext _context;

        public DirectorService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Director> createDirector(DirectorRequest directorRequest)
        {
            var isExist = await _context.Directors.AnyAsync(x => x.Name == directorRequest.Name);
            if (isExist)
            {
                throw new Exception("Đạo diễn đã tồn tại");
            }

            var director = new Director
            {
                DirectorID = Guid.NewGuid(),
                Name = directorRequest.Name
            };

            await _context.Directors.AddAsync(director);
            await _context.SaveChangesAsync();

            return director;
        }

        public async Task<List<Director>> getListDirector()
        {
            var result = await _context.Directors.ToListAsync();
            return result;
        }

        public async Task<Director> updateDirector(Guid id, DirectorRequest directorRequest)
        {
            var director = await _context.Directors.FindAsync(id);

            if (director == null)
            {
                throw new Exception("Không tồn tại đạo diễn này");
            }

            director.Name = directorRequest.Name;

            await _context.SaveChangesAsync();

            return director;
        }

        public async Task<Director> deleteDirector(Guid id)
        {
            var director = await _context.Directors.FindAsync(id);

            if (director == null)
            {
                throw new Exception("Không tồn tại đạo diễn này");
            }

            _context.Directors.Remove(director);
            await _context.SaveChangesAsync();

            return director;
        }
    }
}
