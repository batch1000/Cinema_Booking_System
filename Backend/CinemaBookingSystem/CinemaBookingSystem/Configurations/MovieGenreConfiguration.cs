using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class MovieGenreConfiguration : IEntityTypeConfiguration<MovieGenre>
    {
        public void Configure(EntityTypeBuilder<MovieGenre> entity)
        {
            entity.ToTable("MovieGenre");

            entity.HasKey(e => new { e.MovieID, e.GenreID });

            entity.HasOne(e => e.Movie)
                  .WithMany(d => d.MovieGenres)
                  .HasForeignKey(e => e.MovieID);

            entity.HasOne(e => e.Genre)
                  .WithMany(d => d.MovieGenres)
                  .HasForeignKey(e => e.GenreID);
        }
    }
}
