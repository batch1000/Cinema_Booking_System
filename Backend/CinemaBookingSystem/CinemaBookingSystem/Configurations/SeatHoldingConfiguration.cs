using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class SeatHoldingConfiguration : IEntityTypeConfiguration<SeatHolding>
    {
        public void Configure(EntityTypeBuilder<SeatHolding> entity)
        {
            entity.ToTable("SeatHolding");

            entity.HasKey(e => e.SeatHoldingID);

            entity.Property(e => e.ExpireTime)
                  .IsRequired();

            entity.HasOne(e => e.User)
                  .WithMany(u => u.SeatHoldings)
                  .HasForeignKey(e => e.UserID)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ShowTime)
                  .WithMany(s => s.SeatHoldings)
                  .HasForeignKey(e => e.ShowTimeID)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Seat)
                  .WithMany(s => s.SeatHoldings)
                  .HasForeignKey(e => e.SeatID)
                  .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
