using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class GenreService
    {
        private readonly MyDbContext _context;

        public GenreService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Genre> createGenre(GenreRequest genreRequest)
        {
            var isExist = await _context.Genres.AnyAsync(x => x.Name == genreRequest.Name);
            if(isExist)
            {
                throw new Exception("Thể loại đã tồn tại");
            }

            var genre = new Genre
            {
                GenreID = Guid.NewGuid(),
                Name = genreRequest.Name
            };

            await _context.Genres.AddAsync(genre);
            await _context.SaveChangesAsync();

            return genre;
        }

        public async Task<List<Genre>> getListGenre()
        {
            var result = await _context.Genres.ToListAsync();
            return result;
        }

        public async Task<Genre> updateGenre(Guid id, GenreRequest genreRequest)
        {
            var genre = await _context.Genres.FindAsync(id);

            if(genre == null)
            {
                throw new Exception("Không tồn tại thể loại này");
            }

            genre.Name = genreRequest.Name;

            await _context.SaveChangesAsync();

            return genre;
        }

        public async Task<Genre> deleteGenre(Guid id)
        {
            var genre = await _context.Genres.FindAsync(id);

            if(genre == null)
            {
                throw new Exception("Không tồn tại thể loại này");
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return genre;
        }
    }
}
