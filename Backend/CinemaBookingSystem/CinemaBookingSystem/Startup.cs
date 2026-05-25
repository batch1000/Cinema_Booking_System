using CinemaBookingSystem.Models;
using CinemaBookingSystem.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using CloudinaryDotNet;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using CinemaBookingSystem.Hubs;
using StackExchange.Redis;
using Stripe;

namespace CinemaBookingSystem
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    builder =>
                    {
                        builder
                            .WithOrigins(
                                "http://localhost:3000",
                                "https://cinema-booking-system-gules.vercel.app"
                            )
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    });
            });

            StripeConfiguration.ApiKey = Configuration["Stripe:SecretKey"];


            var redisConnectionString = Configuration["Redis:ConnectionString"];
            services.AddSingleton(new RedisConnection(redisConnectionString));
            services.AddSingleton<RedisService>();

            services.AddSingleton<IConnectionMultiplexer>(
                ConnectionMultiplexer.Connect(redisConnectionString)
            );
            //services.AddHostedService<RedisSubscriberService>();
            services.AddHostedService<RedisPollingService>();

            services.Configure<CloudinarySettings>(
                Configuration.GetSection("CloudinarySettings"));
            services.AddSingleton(provider =>
            {
                var config = provider.GetRequiredService<IOptions<CloudinarySettings>>().Value;

                var account = new CloudinaryDotNet.Account(
                    config.CloudName,
                    config.ApiKey,
                    config.ApiSecret
                );

                return new Cloudinary(account);
            });

            services.Configure<JwtSetting>(Configuration.GetSection("Jwt"));
            var jwtSettings = Configuration.GetSection("Jwt").Get<JwtSetting>();
            var key = Encoding.UTF8.GetBytes(jwtSettings.Key);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });
            services.AddAuthorization();

            services.AddControllers();
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.SuppressModelStateInvalidFilter = false;

                options.InvalidModelStateResponseFactory = context =>
                {
                    var firstError = context.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .Select(e => e.Value.Errors.First().ErrorMessage)
                        .FirstOrDefault();

                    return new BadRequestObjectResult(new
                    {
                        message = firstError
                    });
                };
            });

            services.AddSignalR();

            services.AddDbContext<MyDbContext>(option => option.UseSqlServer(Configuration.GetConnectionString("MyDB")));
            services.AddScoped<CinemaBookingSystem.Services.TokenService>();
            services.AddScoped<CloudinaryService>();
            services.AddScoped<AuthService>();
            services.AddScoped<GenreService>();
            services.AddScoped<DirectorService>();
            services.AddScoped<ActorService>();
            services.AddScoped<LanguageService>();
            services.AddScoped<CountryService>();
            services.AddScoped<StatusService>();
            services.AddScoped<MovieService>();
            services.AddScoped<SeatTypeService>();
            services.AddScoped<CinemaService>();
            services.AddScoped<RoomService>();
            services.AddScoped<SeatService>();
            services.AddScoped<ShowTimeService>();
            services.AddScoped<SeatHubService>();
            services.AddScoped<SeatHoldingService>();
            services.AddScoped<BookingService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("AllowReact");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers().RequireCors("AllowReact");
                endpoints.MapHub<SeatHub>("/seatHub");
            });
        }
    }
}
