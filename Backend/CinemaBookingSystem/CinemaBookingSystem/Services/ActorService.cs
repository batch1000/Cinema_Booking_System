using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class ActorService
    {
        private readonly MyDbContext _context;

        public ActorService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Actor> createActor(ActorRequest actorRequest)
        {
            var isExist = await _context.Actors.AnyAsync(x => x.Name == actorRequest.Name);
            if (isExist)
            {
                throw new Exception("Diễn viên đã tồn tại");
            }

            var actor = new Actor
            {
                ActorID = Guid.NewGuid(),
                Name = actorRequest.Name
            };

            await _context.Actors.AddAsync(actor);
            await _context.SaveChangesAsync();

            return actor;
        }

        public async Task<List<Actor>> getListActor()
        {
            var result = await _context.Actors.ToListAsync();
            return result;
        }

        public async Task<Actor> updateActor(Guid id, ActorRequest actorRequest)
        {
            var actor = await _context.Actors.FindAsync(id);

            if (actor == null)
            {
                throw new Exception("Không tồn tại diễn viên này");
            }

            actor.Name = actorRequest.Name;

            await _context.SaveChangesAsync();

            return actor;
        }

        public async Task<Actor> deleteActor(Guid id)
        {
            var actor = await _context.Actors.FindAsync(id);

            if (actor == null)
            {
                throw new Exception("Không tồn tại diễn viên này");
            }

            _context.Actors.Remove(actor);
            await _context.SaveChangesAsync();

            return actor;
        }
    }
}
