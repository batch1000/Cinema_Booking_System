using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> entity)
        {
            entity.ToTable("User");

            entity.HasKey(e => e.UserID);

            entity.Property(e => e.LastName)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.FirstName)
                 .IsRequired()
                 .HasMaxLength(50);

            entity.Property(e => e.Email)
                 .IsRequired();

            entity.Property(e => e.PhoneNumber)
                 .IsRequired()
                 .HasMaxLength(15);

            entity.Property(e => e.Role)
                 .IsRequired()
                 .HasMaxLength(20);
        }
    }
}
