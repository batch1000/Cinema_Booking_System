using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class CinemaConfiguration : IEntityTypeConfiguration<Cinema>
    {
        public void Configure(EntityTypeBuilder<Cinema> entity)
        {
            entity.ToTable("Cinema");

            entity.HasKey(e => e.CinemaID);

            entity.Property(e => e.Name)
               .IsRequired()
               .HasMaxLength(150);

            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(500);
        }
    }
}
