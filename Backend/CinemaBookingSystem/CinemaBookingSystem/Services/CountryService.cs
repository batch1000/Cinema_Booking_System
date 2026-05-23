using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class CountryService
    {
        private readonly MyDbContext _context;

        public CountryService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Country> createCountry(CountryRequest countryRequest)
        {
            var isExist = await _context.Countries.AnyAsync(x => x.Name == countryRequest.Name);
            if (isExist)
            {
                throw new Exception("Quốc gia đã tồn tại");
            }

            var country = new Country
            {
                CountryID = Guid.NewGuid(),
                Name = countryRequest.Name
            };

            await _context.Countries.AddAsync(country);
            await _context.SaveChangesAsync();

            return country;
        }

        public async Task<List<Country>> getListCountry()
        {
            var result = await _context.Countries.ToListAsync();
            return result;
        }

        public async Task<Country> updateCountry(Guid id, CountryRequest countryRequest)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                throw new Exception("Không tồn tại quốc gia này");
            }

            country.Name = countryRequest.Name;

            await _context.SaveChangesAsync();

            return country;
        }

        public async Task<Country> deleteCountry(Guid id)
        {
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                throw new Exception("Không tồn tại quốc gia này");
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return country;
        }
    }
}
