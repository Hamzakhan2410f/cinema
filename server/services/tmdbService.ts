import axios from 'axios';
import { TMDB_CONFIG } from '../config/tmdb.js';
import { MOCK_MOVIES, MovieItem } from './mockDataService.js';
import { MovieVideoService } from './movieVideoService.js';

export const extractYouTubeId = (input: string | null | undefined): string | null => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/i;
  const match = trimmed.match(regExp);
  return match && match[1] && match[1].length === 11 ? match[1] : null;
};

export interface VideoResult {
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieVideosResponse {
  success: boolean;
  movieId: string;
  trailerKey: string | null;
  trailerUrl: string | null;
  videos: VideoResult[];
}

const KNOWN_TRAILER_KEYS: Record<string, string> = {
  '693134': 'Way9Dexny3w',
  '872585': 'uYPbbksJxIg',
  '572802': 'f_vbAtFSEc0',
  '496243': '5xH0HfJHsaY',
  '372058': 'xU47nhruN-Q',
  '1050035': 'COv52Qyctws',
  '980489': '1bXy2F4L9x0',
  '1011985': '_inKs4eeHiI',
  '940551': 'fTrsp5BMloA',
  '823464': 'x7Krla_UxRg',
  '1022789': 'LEjhY15eCx0',
  '519182': 'qQlr9-rF32E',
  '634649': 'JfVOs4VSwA3',
  '550': 'c25G12H_o24',
  '27205': 'YoHD9XEInc0',
  '157336': 'zSWdZVtXT7E',
  '299536': '6ZfuNTqbHE8',
  '299534': 'TcMBFSGVi1c',
  '414906': 'mqqft2x_AaU',
  '505642': '_Z3QKkl1WyM',
  '19995': '5PSNL1qE6VY',
  '76600': 'd9MyW72ELq0',
  '533535': '73_1biulkYk',
  '912649': '__2bjWbetsA',
  '1184918': 'cqGjhVJWtEg',
};

export class TMDBService {
  private static formatTMDBMovie(item: any): MovieItem {
    const posterPath = item.poster_path
      ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.POSTER_SIZES.LARGE}${item.poster_path}`
      : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600';

    const backdropPath = item.backdrop_path
      ? `${TMDB_CONFIG.IMAGE_BASE_URL}/${TMDB_CONFIG.BACKDROP_SIZES.LARGE}${item.backdrop_path}`
      : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600';

    let trailerKey: string | undefined = undefined;
    let trailerUrl: string | undefined = undefined;

    if (item.videos?.results && Array.isArray(item.videos.results)) {
      const youtubeVideos = item.videos.results.filter((v: any) => v && v.site === 'YouTube' && v.key);
      const officialTrailer =
        youtubeVideos.find((v: any) => v.type === 'Trailer' && v.official) ||
        youtubeVideos.find((v: any) => v.type === 'Trailer') ||
        youtubeVideos[0];
      if (officialTrailer?.key) {
        trailerKey = officialTrailer.key;
        trailerUrl = `https://www.youtube.com/embed/${officialTrailer.key}`;
      }
    }

    if (!trailerUrl) {
      const knownKey = KNOWN_TRAILER_KEYS[String(item.id)];
      if (knownKey) {
        trailerKey = knownKey;
        trailerUrl = `https://www.youtube.com/embed/${knownKey}`;
      } else {
        const mockMatch = MOCK_MOVIES.find((m) => m.externalId === String(item.id));
        if (mockMatch?.trailerUrl) {
          const k = extractYouTubeId(mockMatch.trailerUrl);
          if (k) {
            trailerKey = k;
            trailerUrl = `https://www.youtube.com/embed/${k}`;
          }
        }
      }
    }

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
      trailerKey,
      trailerUrl: trailerUrl || 'https://www.youtube.com/embed/Way9Dexny3w',
      videoUrl: MovieVideoService.getMovieVideo(String(item.id)).videoUrl,
      videoType: MovieVideoService.getMovieVideo(String(item.id)).videoType,
      industry: item.original_language === 'hi' ? 'Bollywood' : item.original_language === 'ko' ? 'Korean' : item.original_language === 'ja' ? 'Japanese' : 'Hollywood',
    };
  }

  static async getMovieVideos(movieId: string): Promise<MovieVideosResponse> {
    const defaultResponse: MovieVideosResponse = {
      success: true,
      movieId,
      trailerKey: null,
      trailerUrl: null,
      videos: [],
    };

    let rawResults: any[] = [];

    if (TMDB_CONFIG.API_KEY) {
      try {
        const res = await axios.get(
          `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_CONFIG.API_KEY}`
        );
        if (res.data?.results && Array.isArray(res.data.results)) {
          rawResults = res.data.results;
        }
      } catch (err) {
        console.warn(`TMDB videos fetch failed for movie ${movieId}:`, (err as any)?.message);
      }
    }

    const youtubeVideos: VideoResult[] = rawResults
      .filter((v: any) => v && v.site === 'YouTube' && v.key)
      .map((v: any) => ({
        key: v.key,
        name: v.name || 'Trailer',
        site: 'YouTube',
        type: v.type || 'Trailer',
        official: Boolean(v.official),
      }));

    if (youtubeVideos.length > 0) {
      youtubeVideos.sort((a, b) => {
        const score = (v: VideoResult) => {
          let s = 0;
          if (v.type === 'Trailer') s += 10;
          if (v.type === 'Teaser') s += 5;
          if (v.official) s += 20;
          return s;
        };
        return score(b) - score(a);
      });

      const primaryKey = youtubeVideos[0].key;
      return {
        success: true,
        movieId,
        trailerKey: primaryKey,
        trailerUrl: `https://www.youtube.com/embed/${primaryKey}`,
        videos: youtubeVideos,
      };
    }

    // Check known fallback mapping
    const known = KNOWN_TRAILER_KEYS[String(movieId)];
    if (known) {
      return {
        success: true,
        movieId,
        trailerKey: known,
        trailerUrl: `https://www.youtube.com/embed/${known}`,
        videos: [
          {
            key: known,
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer',
            official: true,
          },
        ],
      };
    }

    // Fallback: check MOCK_MOVIES
    const mockMatch = MOCK_MOVIES.find((m) => m.externalId === String(movieId));
    if (mockMatch?.trailerUrl) {
      const matchKey = extractYouTubeId(mockMatch.trailerUrl);
      if (matchKey) {
        return {
          success: true,
          movieId,
          trailerKey: matchKey,
          trailerUrl: `https://www.youtube.com/embed/${matchKey}`,
          videos: [
            {
              key: matchKey,
              name: `${mockMatch.title} Official Trailer`,
              site: 'YouTube',
              type: 'Trailer',
              official: true,
            },
          ],
        };
      }
    }

    return defaultResponse;
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
