using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class AuthService
    {
        private readonly MyDbContext _context;
        private readonly TokenService _tokenService;

        public AuthService(MyDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<object> Signup(SignupRequest request)
        {
            var isExist = await _context.Accounts.AnyAsync(x => x.Username == request.UserName);
            if(isExist)
            {
                throw new Exception("Username đã tồn tại");
            }

            var user = new User
            {
                UserID = Guid.NewGuid(),
                LastName = request.LastName,
                FirstName = request.FirstName,
                Email = request.Email,
                PhoneNumber = request.Phone,
                Role = "User"
            };

            var account = new Account
            {
                Username = request.UserName,
                User = user
            };

            var hasher = new PasswordHasher<object>();
            account.Password = hasher.HashPassword(null, request.Password);

            await _context.Accounts.AddAsync(account);
            await _context.SaveChangesAsync();

            return new
            {
                message = "Đăng ký thành công"
            };
        }

        public async Task<object> Login(LoginRequest request)
        {
            var accountDb = await _context.Accounts
                                    .Include(x => x.User)
                                    .FirstOrDefaultAsync(x => x.Username == request.Username);

            if(accountDb == null)
            {
                throw new Exception("Tài khoản không tồn tại");
            }

            var hasher = new PasswordHasher<Account>();
            var result = hasher.VerifyHashedPassword(accountDb, accountDb.Password, request.Password);

            if(result == PasswordVerificationResult.Failed)
            {
                throw new Exception("Sai mật khẩu");
            }

            var token = _tokenService.GenerateToken(accountDb);

            return new
            {
                message = "Đăng nhập thành công",
                token = token,
                userId = accountDb.UserID,
                role = accountDb.User.Role,
                name = accountDb.User.LastName + " " + accountDb.User.FirstName
            };
        }
    }
}
