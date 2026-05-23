using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class MovieDirectorConfiguration : IEntityTypeConfiguration<MovieDirector>
    {
        public void Configure(EntityTypeBuilder<MovieDirector> entity)
        {
            entity.ToTable("MovieDirector");

            entity.HasKey(e => new { e.DirectorID, e.MovieID });

            entity.HasOne(e => e.Movie)
                  .WithMany(d => d.MovieDirectors)
                  .HasForeignKey(e => e.MovieID);

            entity.HasOne(e => e.Director)
                  .WithMany(d => d.MovieDirectors)
                  .HasForeignKey(e => e.DirectorID);
        }
    }
}
