import axios from 'axios';
import { TMDB_CONFIG } from '../config/tmdb.js';
import { MOCK_MOVIES, MovieItem } from './mockDataService.js';

export class TMDBService {
  private static formatTMDBMovie(item: any): MovieItem {
    const posterPath = item.poster_path
      ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZES.LARGE}${item.poster_path}`
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600';

    const backdropPath = item.backdrop_path
      ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZES.LARGE}${item.backdrop_path}`
      : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600';

    return {
      externalId: String(item.id),
      title: item.title || item.name || 'Untitled',
      originalTitle: item.original_title || item.original_name,
      overview: item.overview || 'No overview available for this title.',
      posterPath,
      backdropPath,
      releaseDate: item.release_date || item.first_air_date || '2024-01-01',
      genres: item.genres ? item.genres.map((g: any) => g.name) : ['Drama'],
      languages: item.original_language ? [item.original_language.toUpperCase()] : ['English'],
      countries: item.origin_country || ['USA'],
      runtime: item.runtime || 120,
      rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 7.5,
      voteCount: item.vote_count || 100,
      cast: item.credits?.cast
        ? item.credits.cast.slice(0, 8).map((c: any) => ({
            id: c.id,
            name: c.name,
            character: c.character || 'Cast',
            profilePath: c.profile_path ? `${TMDB_CONFIG.IMAGE_BASE_URL}/w185${c.profile_path}` : undefined,
          }))
        : [],
      directors: item.credits?.crew
        ? item.credits.crew.filter((cr: any) => cr.job === 'Director').map((d: any) => d.name)
        : ['Unknown Director'],
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      industry: item.original_language === 'hi' ? 'Bollywood' : item.original_language === 'ko' ? 'Korean' : item.original_language === 'ja' ? 'Japanese' : 'Hollywood',
    };
  }

  static async getTrending(): Promise<MovieItem[]> {
    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES.filter((m) => m.trending);
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/trending/movie/week?api_key=${TMDB_CONFIG.API_KEY}`);
      return res.data.results.map((m: any) => this.formatTMDBMovie(m));
    } catch (err) {
      return MOCK_MOVIES.filter((m) => m.trending);
    }
  }

  static async getPopular(): Promise<MovieItem[]> {
    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES.filter((m) => m.popular);
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}`);
      return res.data.results.map((m: any) => this.formatTMDBMovie(m));
    } catch (err) {
      return MOCK_MOVIES.filter((m) => m.popular);
    }
  }

  static async getTopRated(): Promise<MovieItem[]> {
    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES.filter((m) => m.topRated);
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/top_rated?api_key=${TMDB_CONFIG.API_KEY}`);
      return res.data.results.map((m: any) => this.formatTMDBMovie(m));
    } catch (err) {
      return MOCK_MOVIES.filter((m) => m.topRated);
    }
  }

  static async getUpcoming(): Promise<MovieItem[]> {
    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES.filter((m) => m.upcoming || m.releaseDate > '2024-01-01');
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/upcoming?api_key=${TMDB_CONFIG.API_KEY}`);
      return res.data.results.map((m: any) => this.formatTMDBMovie(m));
    } catch (err) {
      return MOCK_MOVIES;
    }
  }

  static async getMovieDetails(externalId: string): Promise<MovieItem | null> {
    const mock = MOCK_MOVIES.find((m) => m.externalId === externalId);
    if (mock) return mock;

    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES[0];
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/movie/${externalId}?api_key=${TMDB_CONFIG.API_KEY}&append_to_response=credits,videos`);
      return this.formatTMDBMovie(res.data);
    } catch (err) {
      return MOCK_MOVIES[0];
    }
  }

  static async searchMovies(query: string): Promise<MovieItem[]> {
    const q = query.toLowerCase().trim();
    if (!TMDB_CONFIG.API_KEY) {
      return MOCK_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.overview.toLowerCase().includes(q) ||
          m.cast.some((c) => c.name.toLowerCase().includes(q)) ||
          m.directors.some((d) => d.toLowerCase().includes(q))
      );
    }
    try {
      const res = await axios.get(`${TMDB_CONFIG.BASE_URL}/search/movie?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(query)}`);
      return res.data.results.map((m: any) => this.formatTMDBMovie(m));
    } catch (err) {
      return MOCK_MOVIES;
    }
  }
}
