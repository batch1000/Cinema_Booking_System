using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class MovieConfiguration : IEntityTypeConfiguration<Movie>
    {
        public void Configure(EntityTypeBuilder<Movie> entity)
        {
            entity.ToTable("Movie");

            entity.HasKey(e => e.MovieID);

            entity.Property(e => e.Title)
                   .IsRequired()
                   .HasMaxLength(100);

            entity.Property(e => e.Description)
                   .IsRequired();

            entity.Property(e => e.Duration)
                   .IsRequired();

            entity.Property(e => e.ReleaseDate)
                   .IsRequired()
                   .HasColumnType("date");

            entity.Property(e => e.PosterUrl)
                   .IsRequired()
                   .HasMaxLength(500);

            entity.Property(e => e.TrailerUrl)
                   .IsRequired()
                   .HasMaxLength(500);

            entity.Property(e => e.BannerUrl)
                   .HasMaxLength(500);
            
            entity.Property(e => e.AgeRating)
                   .IsRequired();

            entity.HasOne(e => e.Status)
                  .WithMany(d => d.Movies)
                  .HasForeignKey(e => e.StatusID);

            entity.HasOne(e => e.Country)
                  .WithMany(d => d.Movies)
                  .HasForeignKey(e => e.CountryID);
           
        }
    }
}
