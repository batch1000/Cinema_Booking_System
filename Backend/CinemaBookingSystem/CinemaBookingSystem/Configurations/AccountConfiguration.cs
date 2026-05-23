using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Configurations
{
    public class AccountConfiguration : IEntityTypeConfiguration<Account>
    {
        public void Configure(EntityTypeBuilder<Account> entity)
        {
            entity.ToTable("Account");

            entity.HasKey(e => e.Username);
            entity.Property(e => e.Username)
                .HasMaxLength(50);

            entity.Property(e => e.Password)
                .IsRequired();

            entity.Property(e => e.UserID)
                .IsRequired();

            entity.HasOne(e => e.User)
                  .WithOne(u => u.Account)
                  .HasForeignKey<Account>(e => e.UserID);
        }
    }
}
