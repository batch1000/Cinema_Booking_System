using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class SeatConfiguration : IEntityTypeConfiguration<Seat>
    {
        public void Configure(EntityTypeBuilder<Seat> entity)
        {
            entity.ToTable("Seat");

            entity.HasKey(e => e.SeatID);

            entity.Property(e => e.SeatNumber)
                   .IsRequired()
                   .HasMaxLength(50);

            entity.HasOne(e => e.SeatType)
                   .WithMany(st => st.Seats)
                   .HasForeignKey(e => e.SeatTypeID);

            entity.HasOne(e => e.Room)
                  .WithMany(r => r.Seats)
                  .HasForeignKey(e => e.RoomID);

        }
    }
}
