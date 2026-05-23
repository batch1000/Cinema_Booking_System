using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class StatusService
    {
        private readonly MyDbContext _context;

        public StatusService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Status> createStatus(StatusRequest statusRequest)
        {
            var isExist = await _context.Statuses.AnyAsync(x => x.Name == statusRequest.Name);
            if (isExist)
            {
                throw new Exception("Trạng thái đã tồn tại");
            }

            var status = new Status
            {
                StatusID = Guid.NewGuid(),
                Name = statusRequest.Name
            };

            await _context.Statuses.AddAsync(status);
            await _context.SaveChangesAsync();

            return status;
        }

        public async Task<List<Status>> getListStatus()
        {
            var result = await _context.Statuses.ToListAsync();
            return result;
        }

        public async Task<Status> updateStatus(Guid id, StatusRequest statusRequest)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                throw new Exception("Không tồn tại trạng thái này");
            }

            status.Name = statusRequest.Name;

            await _context.SaveChangesAsync();

            return status;
        }

        public async Task<Status> deleteStatus(Guid id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                throw new Exception("Không tồn tại trạng thái này");
            }

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();

            return status;
        }
    }
}
