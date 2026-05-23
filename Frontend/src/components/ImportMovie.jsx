import { useEffect} from "react";
import { movieService } from "../services/movieService";

const API_KEY = "5dad7df1e56566b42e1b5e737beeb34e";

function ImportMovie() {
  useEffect(() => {
    const importMovies = async () => {
      for (let i = 6; i <= 10; i++) {
        console.log(`\n===== IMPORT PAGE ${i} =====`);

        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${i}`
          );

          const data = await res.json();

          const promises = data.results.map((movie) =>
            fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos,release_dates`
            ).then((res) => res.json())
          );

          const movies = await Promise.all(promises);

          const listMovieFormat = movies
            .map((movie) => convertMovieFormat(movie))
            .filter((movie) => movie && isValidMovie(movie));

          const total = movies.length;
          const valid = listMovieFormat.length;
          const filtered = total - valid;

          console.log(`Page ${i}`);
          console.log(`Total from API : ${total}`);
          console.log(`Valid movies   : ${valid}`);
          console.log(`Filtered out   : ${filtered}`);

          if (valid === 0) {
            console.warn(`⚠ Page ${i}: Không có phim hợp lệ`);
            continue;
          }

          await movieService.importMovieApi(listMovieFormat);

          console.log(`✅ Page ${i}: Import thành công ${valid} phim`);
        } catch (error) {
          console.error(`❌ Page ${i}: Lỗi khi import`, error);
        }
      }
    };

    importMovies();
  }, []);

  const convertMovieFormat = (movie) => {
    const videos = movie.videos?.results || [];

    const video =
      videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
      videos.find((v) => v.type === "Teaser" && v.site === "YouTube") ||
      videos.find((v) => v.site === "YouTube");

    const trailerUrl = video
      ? `https://www.youtube.com/watch?v=${video.key}`
      : null;

    const certification = movie.release_dates?.results
      ?.find((r) => r.iso_3166_1 === "US")
      ?.release_dates?.find((r) => r.certification !== "")?.certification;

    const ratingMap = {
      G: 0,
      PG: 10,
      "PG-13": 13,
      R: 17,
      "NC-17": 18,
    };

    const ageRating = ratingMap[certification] ?? 13;

    const cast = movie.credits?.cast || [];

    const actorCount = Math.min(8, Math.max(3, Math.ceil(cast.length * 0.2)));

    const listActor = cast.slice(0, actorCount).map((actor) => actor.name);

    const listDirector =
      movie.credits?.crew
        ?.filter((person) => person.job === "Director")
        ?.map((director) => director.name) || [];

    const listLanguage =
      movie.spoken_languages?.map((lang) => lang.english_name) || [];

    const listGenre = movie.genres?.map((genre) => genre.name) || [];

    const country = movie.production_countries?.[0]?.name || null;

    return {
      title: movie.title,
      description: movie.overview,
      duration: movie.runtime,
      releaseDate: movie.release_date,
      productionYear: movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : null,
      posterUrl: movie.poster_path
        ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
        : null,
      bannerUrl: movie.backdrop_path
        ? "https://image.tmdb.org/t/p/w1280" + movie.backdrop_path
        : null,
      trailerUrl: trailerUrl,
      ageRating: ageRating,
      country: country,
      listGenre: listGenre,
      listActor: listActor,
      listDirector: listDirector,
      listLanguage: listLanguage,
    };
  };

  const isValidMovie = (movie) => {
    return (
      movie &&
      movie.title &&
      movie.description &&
      movie.duration &&
      movie.releaseDate &&
      movie.productionYear &&
      movie.posterUrl &&
      movie.bannerUrl &&
      movie.trailerUrl &&
      movie.ageRating &&
      movie.country &&
      movie.listGenre.length > 0 &&
      movie.listActor.length > 0 &&
      movie.listDirector.length > 0 &&
      movie.listLanguage.length > 0
    );
  };

  return <h1>Import Movie</h1>;
}

export default ImportMovie;
