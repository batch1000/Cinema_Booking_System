using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CinemaBookingSystem.Configurations
{
    public class ShowTimeConfiguration : IEntityTypeConfiguration<ShowTime>
    {
        public void Configure(EntityTypeBuilder<ShowTime> entity)
        {
            entity.ToTable("ShowTime");

            entity.HasKey(e => e.ShowTimeID);

            entity.Property(e => e.StartTime)
                   .IsRequired();

            entity.Property(e => e.EndTime)
                   .IsRequired();

            entity.Property(e => e.Price)
                    .IsRequired();

            entity.HasOne(e => e.Movie)
                  .WithMany(m => m.ShowTimes)
                  .HasForeignKey(e => e.MovieID);

            entity.HasOne(e => e.Room)
                  .WithMany(r => r.ShowTimes)
                  .HasForeignKey(e => e.RoomID);
        }
    }
}
