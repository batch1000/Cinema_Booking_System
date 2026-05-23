using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class SeatTypeConfiguration : IEntityTypeConfiguration<SeatType>
    {
        public void Configure(EntityTypeBuilder<SeatType> entity)
        {
            entity.ToTable("SeatType");

            entity.HasKey(e => e.SeatTypeID);

            entity.Property(e => e.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.PriceMultiplier)
                 .IsRequired();

            entity.Property(e => e.Description)
                 .IsRequired()
                 .HasMaxLength(100);

            entity.Property(e => e.Color)
                  .IsRequired()
                  .HasMaxLength(30);

        }
    }
}
