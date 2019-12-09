using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivity { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Test> Tests { get; set; }

        public DbSet<UserFollowing> Followings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Value>().HasData(
                new Value() { Id = 1, Name = "Value 101" },
                new Value() { Id = 2, Name = "Value 102" }
            );

            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));
            builder.Entity<UserActivity>().HasOne(u => u.AppUser).WithMany(au => au.UserActivities).HasForeignKey(u => u.AppUserId);
            builder.Entity<UserActivity>().HasOne(a => a.Activity).WithMany(a => a.UserActivities).HasForeignKey(a => a.ActivityId);

            builder.Entity<UserFollowing>(b => {
                b.HasKey(uf => new { uf.ObserverId, uf.TargetId });
                b.HasOne(uf => uf.Observer)
                    .WithMany(au => au.Followings)
                    .HasForeignKey(uf => uf.ObserverId)
                    .OnDelete(DeleteBehavior.Restrict);
                b.HasOne(uf => uf.Target)
                    .WithMany(au => au.Followers)
                    .HasForeignKey(uf => uf.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
