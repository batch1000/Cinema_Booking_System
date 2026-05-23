using CinemaBookingSystem.DTOs;
using CinemaBookingSystem.Exceptions;
using CinemaBookingSystem.Models;
using CloudinaryDotNet;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace CinemaBookingSystem.Services
{
    public class MovieService
    {
        private readonly MyDbContext _context;
        private readonly CloudinaryService _cloudinaryService;
        private readonly RedisService _redisService;

        public MovieService(MyDbContext context, CloudinaryService cloudinaryService, RedisService redisService)
        {
            _context = context;
            _cloudinaryService = cloudinaryService;
            _redisService = redisService;
        }

        public async Task<object> createMovie(MovieRequest movieRequest)
        {
            var movie = new Movie
            {
                MovieID = Guid.NewGuid(),
                Title = movieRequest.Title,
                Description = movieRequest.Description,
                Duration = movieRequest.Duration.Value,
                ReleaseDate = movieRequest.ReleaseDate.Value,
                AgeRating = movieRequest.AgeRating.Value,
                ProductionYear = movieRequest.ProductionYear.Value
            };

            var country = await _context.Countries.FindAsync(movieRequest.CountryId);
            if (country == null)
            {
                throw new BadRequestException("Quốc gia không tồn tại");
            }
            movie.Country = country;

            var status = await _context.Statuses.FindAsync(movieRequest.StatusId);
            if(status == null)
            {
                throw new BadRequestException("Trạng thái không tồn tại");
            }
            movie.Status = status;

            var listMovieGenre = new List<MovieGenre>();
            foreach(var id in movieRequest.ListGenreId)
            {
                var genre = await _context.Genres.FindAsync(id);
                if(genre == null)
                {
                    throw new BadRequestException("Thể loại không tồn tại");
                }

                listMovieGenre.Add(new MovieGenre { 
                    Movie = movie,
                    Genre = genre
                });
            }
            movie.MovieGenres = listMovieGenre;

            var listMovieDirector = new List<MovieDirector>();
            foreach (var id in movieRequest.ListDirectorId)
            {
                var director = await _context.Directors.FindAsync(id);
                if (director == null)
                {
                    throw new BadRequestException("Đạo diễn không tồn tại");
                }

                listMovieDirector.Add(new MovieDirector
                {
                    Movie = movie,
                    Director = director
                });
            }
            movie.MovieDirectors = listMovieDirector;

            var listMovieActor = new List<MovieActor>();
            foreach (var id in movieRequest.ListActorId)
            {
                var actor = await _context.Actors.FindAsync(id);
                if (actor == null)
                {
                    throw new BadRequestException("Diễn viên không tồn tại");
                }

                listMovieActor.Add(new MovieActor
                {
                    Movie = movie,
                    Actor = actor
                });
            }
            movie.MovieActors = listMovieActor;

            var listMovieLanguage = new List<MovieLanguage>();
            foreach (var id in movieRequest.ListLanguageId)
            {
                var language = await _context.Languages.FindAsync(id);
                if (language == null)
                {
                    throw new BadRequestException("Ngôn ngữ không tồn tại");
                }

                listMovieLanguage.Add(new MovieLanguage
                {
                    Movie = movie,
                    Language = language
                });
            }
            movie.MovieLanguages = listMovieLanguage;

            var posterUrl = await _cloudinaryService.UploadImageAsync(movieRequest.Poster);
            if(posterUrl != null)
            {
                movie.PosterUrl = posterUrl;
            }

            var trailerUrl = await _cloudinaryService.UploadVideoAsync(movieRequest.Trailer);
            if(trailerUrl != null)
            {
                movie.TrailerUrl = trailerUrl;
            }

            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();
            return new
            {
                movie.MovieID
            };
        }

        public async Task<object> getMovieById(Guid id)
        {
            var movie = await _context.Movies
                            .Where(m => m.MovieID == id)
                            .Select(m => new MovieReponse
                            {
                                MovieID = m.MovieID,
                                Title = m.Title,
                                Description = m.Description,
                                Duration = m.Duration,
                                ReleaseDate = m.ReleaseDate.ToString("yyyy-MM-dd"),
                                PosterUrl = m.PosterUrl,
                                TrailerUrl = m.TrailerUrl,
                                BannerUrl = m.BannerUrl,
                                AgeRating = m.AgeRating,
                                ProductionYear = m.ProductionYear,
                                Country = new
                                {
                                    CountryID = m.CountryID,
                                    Name = m.Country.Name
                                },
                                Status = new
                                {
                                    StatusID = m.StatusID,
                                    Name = m.Status.Name
                                },
                                ListGenre = m.MovieGenres.Select(mg => (object)new { GenreID = mg.GenreID, Name = mg.Genre.Name }).ToList(),
                                ListActor = m.MovieActors.Select(ma => (object)new { ActorID = ma.ActorID, Name = ma.Actor.Name }).ToList(),
                                ListDirector = m.MovieDirectors.Select(md => (object)new { DirectorID = md.DirectorID, Name = md.Director.Name }).ToList(),
                                ListLanguage = m.MovieLanguages.Select(ml => (object)new { LanguageID = ml.LanguageID, Name = ml.Language.Name }).ToList()
                            })
                            .FirstOrDefaultAsync();
            if(movie == null)
            {
                throw new BadRequestException("Không tìm thấy phim");
            }

            return movie;
        }

        public async Task<List<MovieReponse>> getListMovie(int page, int pageSize, FilterMovie filterMovie)
        {
            var query = _context.Movies.AsQueryable();

            if(filterMovie.Genre != null && filterMovie.Genre != "all")
            {
                if(Guid.TryParse(filterMovie.Genre, out Guid genreId)) {
                    query = query.Where(m => m.MovieGenres.Any(mg => mg.GenreID == genreId));
                }
            }

            if(filterMovie.GenreName != null && filterMovie.GenreName != "all")
            {
                query = query.Where(m => m.MovieGenres.Any(mg => mg.Genre.Name == filterMovie.GenreName));
            }

            if (filterMovie.Status != null && filterMovie.Status != "all")
            {
                if (Guid.TryParse(filterMovie.Status, out Guid statusId))
                {
                    query = query.Where(m => m.StatusID == statusId);
                }
            }

            if (filterMovie.CountryId != null && filterMovie.CountryId != "all")
            {
                if(Guid.TryParse(filterMovie.CountryId, out Guid countryIdParse))
                {
                    query = query.Where(m => m.CountryID == countryIdParse);
                }
            }

            if (filterMovie.CinemaId != null && filterMovie.CinemaId != "all")
            {
                if (Guid.TryParse(filterMovie.CinemaId, out Guid cinemaIdParse))
                {
                    query = query
                        .Where(m => 
                            m.ShowTimes.Any(st => 
                                st.Room.CinemaID == cinemaIdParse &&
                                st.StartTime > DateTime.Now
                            )
                        );
                }
            }

            if (filterMovie.Country != null && filterMovie.Country != "all")
            {
                query = query.Where(m => m.Country.Name == filterMovie.Country);
            }

            if (filterMovie.ShowTimeId != null && filterMovie.ShowTimeId != "all")
            {
                if (Guid.TryParse(filterMovie.ShowTimeId, out Guid showTimeIdParse))
                {
                    query = query
                        .Where(m => m.ShowTimes.Any(st => st.ShowTimeID == showTimeIdParse));
                }
            }

            if (!string.IsNullOrWhiteSpace(filterMovie.Keyword))
            {
                query = query.Where(
                    m => m.Title.Contains(filterMovie.Keyword) || 
                         m.MovieActors.Any(ma => ma.Actor.Name.Contains(filterMovie.Keyword))
                );
            }

            if (filterMovie.DateFilter.HasValue)
            {
                query = query.Where(m =>
                    m.ShowTimes.Any(st => st.StartTime.Date == filterMovie.DateFilter.Value.Date)
                );
            }

            return await query
                .OrderByDescending(m => m.ReleaseDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(m => new MovieReponse
                {
                    MovieID = m.MovieID,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate.ToString("yyyy-MM-dd"),
                    PosterUrl = m.PosterUrl,
                    TrailerUrl = m.TrailerUrl,
                    BannerUrl = m.BannerUrl,
                    AgeRating = m.AgeRating,
                    ProductionYear = m.ProductionYear,
                    Country = new
                    {
                        CountryID = m.CountryID,
                        Name = m.Country.Name
                    },
                    Status = new
                    {
                        StatusID = m.StatusID,
                        Name = m.Status.Name
                    },
                    ListGenre = m.MovieGenres.Select(mg => (object)new { genreID = mg.GenreID, name = mg.Genre.Name}).ToList(),
                    ListActor = m.MovieActors.Select(ma => (object)new { actorID = ma.ActorID, name = ma.Actor.Name }).ToList(),
                    ListDirector = m.MovieDirectors.Select(md => (object)new { directorID = md.DirectorID, name = md.Director.Name }).ToList(),
                    ListLanguage = m.MovieLanguages.Select(ml => (object)new { languageID = ml.LanguageID, name = ml.Language.Name }).ToList()
                })
                .ToListAsync();
        }

        public async Task<List<MovieReponse>> getAllListMovie()
        {
            var query = _context.Movies.AsQueryable();

            return await query
                .OrderByDescending(m => m.ReleaseDate)
                .Select(m => new MovieReponse
                {
                    MovieID = m.MovieID,
                    Title = m.Title,
                    Description = m.Description,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate.ToString("yyyy-MM-dd"),
                    PosterUrl = m.PosterUrl,
                    TrailerUrl = m.TrailerUrl,
                    BannerUrl = m.BannerUrl,
                    AgeRating = m.AgeRating,
                    ProductionYear = m.ProductionYear,
                    Country = new
                    {
                        CountryID = m.CountryID,
                        Name = m.Country.Name
                    },
                    Status = new
                    {
                        StatusID = m.StatusID,
                        Name = m.Status.Name
                    },
                    ListGenre = m.MovieGenres.Select(mg => (object)new { GenreID = mg.GenreID, Name = mg.Genre.Name }).ToList(),
                    ListActor = m.MovieActors.Select(ma => (object)new { ActorID = ma.ActorID, Name = ma.Actor.Name }).ToList(),
                    ListDirector = m.MovieDirectors.Select(md => (object)new { DirectorID = md.DirectorID, Name = md.Director.Name }).ToList(),
                    ListLanguage = m.MovieLanguages.Select(ml => (object)new { LanguageID = ml.LanguageID, Name = ml.Language.Name }).ToList()
                })
                .ToListAsync();
        }

        public async Task<object> getTotalPage(int pageSize, FilterMovie filterMovie)
        {
            var query = _context.Movies.AsQueryable();

            if (filterMovie.Genre != null && filterMovie.Genre != "all")
            {
                if (Guid.TryParse(filterMovie.Genre, out Guid genreId))
                {
                    query = query.Where(m => m.MovieGenres.Any(mg => mg.GenreID == genreId));
                }
            }

            if (filterMovie.Status != null && filterMovie.Status != "all")
            {
                if (Guid.TryParse(filterMovie.Status, out Guid statusId))
                {
                    query = query.Where(m => m.StatusID == statusId);
                }
            }

            if (filterMovie.CountryId != null && filterMovie.CountryId != "all")
            {
                if (Guid.TryParse(filterMovie.CountryId, out Guid countryIdParse))
                {
                    query = query.Where(m => m.CountryID == countryIdParse);
                }
            }

            if (filterMovie.CinemaId != null && filterMovie.CinemaId != "all")
            {
                if (Guid.TryParse(filterMovie.CinemaId, out Guid cinemaIdParse))
                {
                    query = query
                        .Where(m =>
                            m.ShowTimes.Any(st =>
                                st.Room.CinemaID == cinemaIdParse &&
                                st.StartTime > DateTime.Now
                            )
                        );
                }
            }

            if (filterMovie.ShowTimeId != null && filterMovie.ShowTimeId != "all")
            {
                Console.WriteLine("Show Time Filter: " + filterMovie.ShowTimeId);
                if (Guid.TryParse(filterMovie.ShowTimeId, out Guid showTimeIdParse))
                {
                    query = query
                        .Where(m => m.ShowTimes.Any(st => st.ShowTimeID == showTimeIdParse));
                }
            }

            if (!string.IsNullOrWhiteSpace(filterMovie.Keyword))
            {
                query = query.Where(
                    m => m.Title.Contains(filterMovie.Keyword) ||
                         m.MovieActors.Any(ma => ma.Actor.Name.Contains(filterMovie.Keyword))
                );
            }

            if (filterMovie.DateFilter.HasValue)
            {
                query = query.Where(m =>
                    m.ShowTimes.Any(st => st.StartTime.Date == filterMovie.DateFilter.Value.Date)
                );
            }

            var totalMovie = await query.CountAsync();
            var totalPage = (int)Math.Ceiling((double)totalMovie / pageSize);

            var listGroupbyStatus = await query
                                        .GroupBy(m => m.Status.Name)
                                        .Select(m => new
                                        {
                                            Name = m.Key,
                                            Total = m.Count()
                                        })
                                        .ToListAsync();

            return new
            {
                totalMovie,
                totalPage,
                listGroupbyStatus
            };
        }

        public async Task<MovieReponse> updateMovie(Guid id, MovieRequest movieRequest)
        {
            var movie = await _context.Movies.FindAsync(id);
            if(movie == null)
            {
                throw new BadRequestException("Không tìm thấy phim");
            }

            if (movie.ReleaseDate.Date != movieRequest.ReleaseDate?.Date && movieRequest.ReleaseDate < DateTime.Today)
            {
                throw new BadRequestException("Ngày khởi chiếu không được nhỏ hơn hôm nay");
            }

            movie.Title = movieRequest.Title;
            movie.Description = movieRequest.Description;
            movie.Duration = movieRequest.Duration.Value;
            movie.ReleaseDate = movieRequest.ReleaseDate.Value;
            movie.AgeRating = movieRequest.AgeRating.Value;
            movie.ProductionYear = movieRequest.ProductionYear.Value;

            var countryIdExist = await _context.Countries.AnyAsync(c => c.CountryID == movieRequest.CountryId);
            if(!countryIdExist)
            {
                throw new BadRequestException("Không tìm thấy quốc gia");
            }
            movie.CountryID = movieRequest.CountryId;

            var statusIdExist = await _context.Statuses.AnyAsync(s => s.StatusID == movieRequest.StatusId);
            if (!statusIdExist)
            {
                throw new BadRequestException("Không tìm thấy trạng thái");
            }
            movie.StatusID = movieRequest.StatusId;

            var countGenreExist = await _context.Genres.CountAsync(g => movieRequest.ListGenreId.Contains(g.GenreID));
            if(countGenreExist != movieRequest.ListGenreId.Count)
            {
                throw new BadRequestException("Có ít nhất 1 thể loại không tồn tại");
            }

            var oldListMovieGenre = await _context.MovieGenres
                                             .Where(mg => mg.MovieID == id)
                                             .ToListAsync();

            _context.MovieGenres.RemoveRange(oldListMovieGenre);
            var newListMovieGenre = movieRequest.ListGenreId
                                    .Select(idGenre => new MovieGenre
                                    {
                                        MovieID = id,
                                        GenreID = idGenre
                                    });
            await _context.MovieGenres.AddRangeAsync(newListMovieGenre);


            var countActorExist = await _context.Actors.CountAsync(a => movieRequest.ListActorId.Contains(a.ActorID));
            if (countActorExist != movieRequest.ListActorId.Count)
            {
                throw new BadRequestException("Có ít nhất 1 diễn viên không tồn tại");
            }

            var oldListMovieActor = await _context.MovieActors
                                             .Where(mg => mg.MovieID == id)
                                             .ToListAsync();

            _context.MovieActors.RemoveRange(oldListMovieActor);
            var newListMovieActor = movieRequest.ListActorId
                                    .Select(idActor => new MovieActor
                                    {
                                        MovieID = id,
                                        ActorID = idActor
                                    });
            await _context.MovieActors.AddRangeAsync(newListMovieActor);


            var countDirectorExist = await _context.Directors.CountAsync(a => movieRequest.ListDirectorId.Contains(a.DirectorID));
            if (countDirectorExist != movieRequest.ListDirectorId.Count)
            {
                throw new BadRequestException("Có ít nhất 1 đạo diễn không tồn tại");
            }

            var oldListMovieDirector = await _context.MovieDirectors
                                             .Where(mg => mg.MovieID == id)
                                             .ToListAsync();

            _context.MovieDirectors.RemoveRange(oldListMovieDirector);
            var newListMovieDirector = movieRequest.ListDirectorId
                                    .Select(idDirector => new MovieDirector
                                    {
                                        MovieID = id,
                                        DirectorID = idDirector
                                    });
            await _context.MovieDirectors.AddRangeAsync(newListMovieDirector);


            var countLanguageExist = await _context.Languages.CountAsync(a => movieRequest.ListLanguageId.Contains(a.LanguageID));
            if (countLanguageExist != movieRequest.ListLanguageId.Count)
            {
                throw new BadRequestException("Có ít nhất 1 ngôn ngữ không tồn tại");
            }

            var oldListMovieLanguage = await _context.MovieLanguages
                                             .Where(mg => mg.MovieID == id)
                                             .ToListAsync();

            _context.MovieLanguages.RemoveRange(oldListMovieLanguage);
            var newListMovieLanguage = movieRequest.ListLanguageId
                                    .Select(idLanguage => new MovieLanguage
                                    {
                                        MovieID = id,
                                        LanguageID = idLanguage
                                    });
            await _context.MovieLanguages.AddRangeAsync(newListMovieLanguage);

            if(movieRequest.Poster != null)
            {
                var posterUrl = await _cloudinaryService.UploadImageAsync(movieRequest.Poster);
                if(posterUrl != null)
                {
                    movie.PosterUrl = posterUrl;
                    Console.WriteLine("Update Poster");
                }
            }

            if(movieRequest.Trailer != null)
            {
                var trailerUrl = await _cloudinaryService.UploadVideoAsync(movieRequest.Trailer);
                if(trailerUrl != null)
                {
                    movie.TrailerUrl = trailerUrl;
                    Console.WriteLine("Update Trailer");
                }
            }

            await _context.SaveChangesAsync();

            var updatedMovie = await _context.Movies
                                .Include(m => m.Country)
                                .Include(m => m.Status)
                                .Include(m => m.MovieActors).ThenInclude(ma => ma.Actor)
                                .Include(m => m.MovieDirectors).ThenInclude(md => md.Director)
                                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                                .Include(m => m.MovieLanguages).ThenInclude(ml => ml.Language)
                                .FirstOrDefaultAsync(m => m.MovieID == id);

            return new MovieReponse
            {
                MovieID = updatedMovie.MovieID,
                Title = updatedMovie.Title,
                Description = updatedMovie.Description,
                Duration = updatedMovie.Duration,
                ReleaseDate = updatedMovie.ReleaseDate.ToString("yyyy-MM-dd"),
                PosterUrl = updatedMovie.PosterUrl,
                TrailerUrl = updatedMovie.TrailerUrl,
                AgeRating = updatedMovie.AgeRating,
                ProductionYear = updatedMovie.ProductionYear,

                Country = new
                {
                    CountryID = updatedMovie.Country.CountryID,
                    Name = updatedMovie.Country.Name
                },

                Status = new
                {
                    StatusID = updatedMovie.Status.StatusID,
                    Name = updatedMovie.Status.Name
                },

                ListGenre = updatedMovie.MovieGenres
                    .Select(mg => (object)new { GenreID = mg.GenreID, Name = mg.Genre.Name })
                    .ToList(),

                ListActor = updatedMovie.MovieActors
                    .Select(ma => (object)new { ActorID = ma.ActorID, Name = ma.Actor.Name })
                    .ToList(),

                ListDirector = updatedMovie.MovieDirectors
                    .Select(md => (object)new { DirectorID = md.DirectorID, Name = md.Director.Name })
                    .ToList(),

                ListLanguage = updatedMovie.MovieLanguages
                    .Select(ml => (object)new { LanguageID = ml.LanguageID, Name = ml.Language.Name })
                    .ToList()
            };
        } 

        public async Task<object> deleteMovie(Guid id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if(movie == null)
            {
                throw new BadRequestException("Phim không tồn tại");
            }

 
            var movieGenre = await _context.MovieGenres
                                        .Where(mg => mg.MovieID == id)
                                        .ToListAsync();

            _context.MovieGenres.RemoveRange(movieGenre);


            var movieActor = await _context.MovieActors
                                        .Where(mg => mg.MovieID == id)
                                        .ToListAsync();
            _context.MovieActors.RemoveRange(movieActor);


            var movieDirector = await _context.MovieDirectors
                                        .Where(mg => mg.MovieID == id)
                                        .ToListAsync();
            _context.MovieDirectors.RemoveRange(movieDirector);


            var movieLanguage = await _context.MovieLanguages
                                        .Where(mg => mg.MovieID == id)
                                        .ToListAsync();
            _context.MovieLanguages.RemoveRange(movieLanguage);

            _context.Movies.Remove(movie);

            await _context.SaveChangesAsync();
            return new
            {
                movieID = id
            };
        }

        public async Task<object> importMovieApi(List<MovieApiRequest> listMovie)
        {
            Console.WriteLine("Enter Service Import");

            foreach(var item in listMovie)
            {
                var existMovie = _context.Movies.Local
                    .FirstOrDefault(m => m.Title == item.Title)
                 ?? await _context.Movies
                    .FirstOrDefaultAsync(m => m.Title == item.Title);
                if (existMovie != null)
                {
                    Console.WriteLine("Đã bỏ qua phim đã tồn tại: " + item.Title);
                    continue;
                }

                var statusFind = await _context.Statuses
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Name == "Sắp chiếu");

                if (statusFind == null)
                {
                    throw new Exception("Không tìm thấy status");
                }

                var statusFindID = statusFind.StatusID;

                Movie movie = new Movie
                {
                    MovieID = Guid.NewGuid(),
                    Title = item.Title,
                    Description = item.Description,
                    Duration = item.Duration,
                    ReleaseDate = item.ReleaseDate,
                    AgeRating = item.AgeRating,
                    ProductionYear = item.ProductionYear,
                    PosterUrl = item.PosterUrl,
                    TrailerUrl = item.TrailerUrl,
                    BannerUrl = item.BannerUrl,
                    StatusID = statusFindID
                };

                var country = _context.Countries.Local 
                                .FirstOrDefault(country => country.Name == item.Country)
                                ?? await _context.Countries
                                .FirstOrDefaultAsync(country => country.Name == item.Country);
                if(country == null)
                {
                    country = new Country
                    {
                        CountryID = Guid.NewGuid(),
                        Name = item.Country
                    };
                    await _context.Countries.AddAsync(country);
                }
                movie.CountryID = country.CountryID;
             

                foreach(var name in item.ListActor)
                {
                    var actor = _context.Actors.Local
                                .FirstOrDefault(i => i.Name == name)
                                  ?? await _context.Actors
                                        .FirstOrDefaultAsync(i => i.Name == name);
                    if (actor == null)
                    {
                        actor = new Actor
                        {
                            ActorID = Guid.NewGuid(),
                            Name = name
                        };

                        await _context.Actors.AddAsync(actor);
                    }

                    await _context.MovieActors.AddAsync(new MovieActor { 
                        MovieID = movie.MovieID,
                        ActorID = actor.ActorID
                    });
                }

                foreach (var name in item.ListDirector)
                {
                    var director = _context.Directors.Local
                                        .FirstOrDefault(i => i.Name == name)
                                     ?? await _context.Directors
                                        .FirstOrDefaultAsync(i => i.Name == name);
                    if (director == null)
                    {
                        director = new Director
                        {
                            DirectorID = Guid.NewGuid(),
                            Name = name
                        };

                        await _context.Directors.AddAsync(director);
                    }

                    await _context.MovieDirectors.AddAsync(new MovieDirector
                    {
                        MovieID = movie.MovieID,
                        DirectorID = director.DirectorID
                    });
                }

                foreach (var name in item.ListGenre)
                {
                    var genre = _context.Genres.Local
                                        .FirstOrDefault(i => i.Name == name)
                                  ?? await _context.Genres
                                        .FirstOrDefaultAsync(i => i.Name == name);
                    if (genre == null)
                    {
                        genre = new Genre
                        {
                            GenreID = Guid.NewGuid(),
                            Name = name
                        };

                        await _context.Genres.AddAsync(genre);
                    }

                    await _context.MovieGenres.AddAsync(new MovieGenre
                    {
                        MovieID = movie.MovieID,
                        GenreID = genre.GenreID
                    });
                }

                foreach (var name in item.ListLanguage)
                {
                    var language = _context.Languages.Local
                                        .FirstOrDefault(i => i.Name == name)
                                    ?? await _context.Languages
                                        .FirstOrDefaultAsync(i => i.Name == name);
                    if (language == null)
                    {
                        language = new Language
                        {
                            LanguageID = Guid.NewGuid(),
                            Name = name
                        };

                        await _context.Languages.AddAsync(language);
                    }

                    await _context.MovieLanguages.AddAsync(new MovieLanguage
                    {
                        MovieID = movie.MovieID,
                        LanguageID = language.LanguageID
                    });
                }

                await _context.Movies.AddAsync(movie);
                Console.WriteLine(movie.Title);
            }

            await _context.SaveChangesAsync();
            return new
            {
                message = "Thêm phim từ api thành công"
            };
        }

        public async Task<List<MovieReponse>> getListMovieBanner(int page, int pageSize, FilterMovie filterMovie)
        {
            var key = $"getListMovieBanner:{page}:{pageSize}";

            var cache = await _redisService.GetAsync(key);

            if (string.IsNullOrWhiteSpace(cache))
            {
                var result = await getListMovie(page, pageSize, filterMovie);
                await _redisService.SetIfNotExistAsync(key, JsonSerializer.Serialize(result), TimeSpan.FromMinutes(10));
                return result;
            }
            else
            {
                await _redisService.ExtendTimeToLiveAsync(key, TimeSpan.FromMinutes(10));
                return JsonSerializer.Deserialize<List<MovieReponse>>(cache) ?? new List<MovieReponse>();
            }
        }

        public async Task<List<MovieReponse>> getListMovieByCountry(int page, int pageSize, FilterMovie filterMovie)
        {
            var countryKey = Uri.EscapeDataString(filterMovie.Country ?? "all");
            var key = $"getListMovieCountry:{countryKey}:{page}:{pageSize}";

            var cache = await _redisService.GetAsync(key);

            if (string.IsNullOrWhiteSpace(cache))
            {
                var result = await getListMovie(page, pageSize, filterMovie);
                await _redisService.SetIfNotExistAsync(key, JsonSerializer.Serialize(result), TimeSpan.FromMinutes(10));
                return result;
            }
            else
            {
                await _redisService.ExtendTimeToLiveAsync(key, TimeSpan.FromMinutes(10));
                return JsonSerializer.Deserialize<List<MovieReponse>>(cache) ?? new List<MovieReponse>();
            }
        }

        public async Task<List<MovieReponse>> getListMovieByGenre(int page, int pageSize, FilterMovie filterMovie)
        {
            var genreKey = Uri.EscapeDataString(filterMovie.GenreName ?? "all");
            var key = $"getListMovieByGenre:{genreKey}:{page}:{pageSize}";

            var cache = await _redisService.GetAsync(key);

            if (string.IsNullOrWhiteSpace(cache))
            {
                var result = await getListMovie(page, pageSize, filterMovie);
                await _redisService.SetIfNotExistAsync(key, JsonSerializer.Serialize(result), TimeSpan.FromMinutes(10));
                return result;
            }
            else
            {
                await _redisService.ExtendTimeToLiveAsync(key, TimeSpan.FromMinutes(10));
                return JsonSerializer.Deserialize<List<MovieReponse>>(cache) ?? new List<MovieReponse>();
            }
        }
    }
}
