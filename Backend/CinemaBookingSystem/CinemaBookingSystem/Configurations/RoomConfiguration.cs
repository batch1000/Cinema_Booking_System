using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> entity)
        {
            entity.ToTable("Room");

            entity.HasKey(e => e.RoomID);

            entity.Property(e => e.Name)
              .IsRequired()
              .HasMaxLength(100);

            entity.HasOne(e => e.Cinema)
                  .WithMany(c => c.Rooms)
                  .HasForeignKey(e => e.CinemaID);
        }
    }
}
