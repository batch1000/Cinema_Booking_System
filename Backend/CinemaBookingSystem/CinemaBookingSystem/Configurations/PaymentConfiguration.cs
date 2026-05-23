using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> entity)
        {
            entity.ToTable("Payment");

            entity.HasKey(e => e.PaymentID);

            entity.Property(e => e.Amount)
                  .IsRequired();


            entity.Property(e => e.CreateAt)
                    .IsRequired();

            entity.HasOne(e => e.Booking)
                  .WithOne(b => b.Payment)
                  .HasForeignKey<Payment>(e => e.BookingID);
        }
    }
}
