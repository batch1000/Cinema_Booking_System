using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class BookingSeatConfiguration : IEntityTypeConfiguration<BookingSeat>
    {
        public void Configure(EntityTypeBuilder<BookingSeat> entity)
        {
            entity.ToTable("BookingSeat");

            entity.HasKey(e => e.BookingSeatID);

            entity.HasOne(e => e.Booking)
                  .WithMany(b => b.BookingSeats)
                  .HasForeignKey(e => e.BookingID)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Seat)
                  .WithMany(s => s.BookingSeats)
                  .HasForeignKey(e => e.SeatID)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
