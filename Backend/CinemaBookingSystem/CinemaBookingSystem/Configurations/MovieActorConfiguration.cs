using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class MovieActorConfiguration : IEntityTypeConfiguration<MovieActor>
    {
        public void Configure(EntityTypeBuilder<MovieActor> entity)
        {
            entity.ToTable("MovieActor");

            entity.HasKey(e => new { e.ActorID, e.MovieID });

            entity.HasOne(e => e.Movie)
                  .WithMany(e => e.MovieActors)
                  .HasForeignKey(e => e.MovieID);

            entity.HasOne(e => e.Actor)
                  .WithMany(e => e.MovieActors)
                  .HasForeignKey(e => e.ActorID);
        }
    }
}
