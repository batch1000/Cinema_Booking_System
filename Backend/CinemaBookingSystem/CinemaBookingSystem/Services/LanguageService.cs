using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class LanguageService
    {
        private readonly MyDbContext _context;

        public LanguageService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Language> createLanguage(LanguageRequest languageRequest)
        {
            var isExist = await _context.Languages.AnyAsync(x => x.Name == languageRequest.Name);
            if (isExist)
            {
                throw new Exception("Ngôn ngữ đã tồn tại");
            }

            var language = new Language
            {
                LanguageID = Guid.NewGuid(),
                Name = languageRequest.Name
            };

            await _context.Languages.AddAsync(language);
            await _context.SaveChangesAsync();

            return language;
        }

        public async Task<List<Language>> getListLanguage()
        {
            var result = await _context.Languages.ToListAsync();
            return result;
        }

        public async Task<Language> updateLanguage(Guid id, LanguageRequest languageRequest)
        {
            var language = await _context.Languages.FindAsync(id);

            if (language == null)
            {
                throw new Exception("Không tồn tại ngôn ngữ này");
            }

            language.Name = languageRequest.Name;

            await _context.SaveChangesAsync();

            return language;
        }

        public async Task<Language> deleteLanguage(Guid id)
        {
            var language = await _context.Languages.FindAsync(id);

            if (language == null)
            {
                throw new Exception("Không tồn tại ngôn ngữ này");
            }

            _context.Languages.Remove(language);
            await _context.SaveChangesAsync();

            return language;
        }
    }
}
