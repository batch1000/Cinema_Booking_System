using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class MovieLanguageConfiguration : IEntityTypeConfiguration<MovieLanguage>
    {
        public void Configure(EntityTypeBuilder<MovieLanguage> entity)
        {
            entity.ToTable("MovieLanguage");

            entity.HasKey(e => new { e.LanguageID, e.MovieID });

            entity.HasOne(e => e.Movie)
                  .WithMany(d => d.MovieLanguages)
                  .HasForeignKey(e => e.MovieID);

            entity.HasOne(e => e.Language)
                  .WithMany(d => d.MovieLanguages)
                  .HasForeignKey(e => e.LanguageID);
        }
    }
}
