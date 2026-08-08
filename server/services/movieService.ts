import Movie from '../models/Movie.js';
import { TMDBService } from './tmdbService.js';
import { MOCK_MOVIES, MovieItem } from './mockDataService.js';

export class MovieService {
  static async getAllMovies(): Promise<MovieItem[]> {
    try {
      const dbMovies = await Movie.find().lean();
      if (dbMovies && dbMovies.length > 0) {
        return dbMovies as unknown as MovieItem[];
      }
    } catch (e) {
      // Fallback
    }
    return MOCK_MOVIES;
  }

  static async getByGenre(genreName: string): Promise<MovieItem[]> {
    const all = await this.getAllMovies();
    const target = genreName.toLowerCase();
    return all.filter((m) => m.genres.some((g) => g.toLowerCase() === target));
  }

  static async getByIndustry(industryName: string): Promise<MovieItem[]> {
    const all = await this.getAllMovies();
    const target = industryName.toLowerCase();
    return all.filter((m) => m.industry.toLowerCase() === target);
  }

  static async getById(id: string): Promise<MovieItem | null> {
    try {
      const dbMovie = await Movie.findOne({ externalId: id }).lean();
      if (dbMovie) return dbMovie as unknown as MovieItem;
    } catch (e) {}

    return TMDBService.getMovieDetails(id);
  }
}
