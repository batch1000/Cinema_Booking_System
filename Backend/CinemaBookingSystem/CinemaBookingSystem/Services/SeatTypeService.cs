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
    public class SeatTypeService
    {
        private readonly MyDbContext _context;

        public SeatTypeService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<SeatType> createSeatType(SeatTypeRequest seatTypeRequest)
        {
            var seatType = new SeatType
            {
                SeatTypeID = Guid.NewGuid(),
                Name = seatTypeRequest.Name,
                PriceMultiplier = seatTypeRequest.PriceMultiplier.Value,
                Description = seatTypeRequest.Description,
                Color = seatTypeRequest.Color
            };

            await _context.SeatTypes.AddAsync(seatType);
            await _context.SaveChangesAsync();

            return seatType;
        }

        public async Task<List<SeatType>> getListSeatType()
        {
            return await _context.SeatTypes
                   .Select(st => new SeatType
                   {
                       SeatTypeID = st.SeatTypeID,
                       Name = st.Name,
                       PriceMultiplier = st.PriceMultiplier,
                       Description = st.Description,
                       Color = st.Color
                   })
                   .ToListAsync();
                   
        }

        public async Task<SeatType> updateSeatType(Guid id, SeatTypeRequest seatTypeRequest)
        {
            var seatType = await _context.SeatTypes.FindAsync(id);
            if(seatType == null)
            {
                throw new BadRequestException("Không tìm thấy loại ghế này");
            }

            seatType.Name = seatTypeRequest.Name;
            seatType.PriceMultiplier = seatTypeRequest.PriceMultiplier.Value;
            seatType.Description = seatTypeRequest.Description;
            seatType.Color = seatTypeRequest.Color;

            await _context.SaveChangesAsync();
            
            return seatType;
        }

        public async Task<bool> deleteSeatType(Guid id)
        {
            var seatType = await _context.SeatTypes.FindAsync(id);
            if (seatType == null)
            {
                throw new BadRequestException("Không tìm thấy loại ghế này");
            }

            _context.SeatTypes.Remove(seatType);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
