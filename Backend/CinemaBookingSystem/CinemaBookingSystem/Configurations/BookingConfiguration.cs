using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> entity)
        {
            entity.ToTable("Booking");

            entity.HasKey(e => e.BookingID);

            entity.Property(e => e.TotalPrice)
                    .IsRequired();

            entity.Property(e => e.CreateAt)
                    .IsRequired();

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Bookings)
                  .HasForeignKey(e => e.UserID);

            entity.HasOne(e => e.ShowTime)
                  .WithMany(s => s.Bookings)
                  .HasForeignKey(e => e.ShowTimeID);
        }
    }
}
