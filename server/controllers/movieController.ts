import { Request, Response } from 'express';
import { TMDBService } from '../services/tmdbService.js';
import { MovieService } from '../services/movieService.js';
import { MOCK_MOVIES } from '../services/mockDataService.js';

export const getTrendingMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await TMDBService.getTrending();
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPopularMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await TMDBService.getPopular();
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopRatedMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await TMDBService.getTopRated();
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await TMDBService.getUpcoming();
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    let movies = await MovieService.getAllMovies();
    const { genre, language, country, year, rating, search, sortBy, page = 1, limit = 20 } = req.query;

    if (search) {
      const q = String(search).toLowerCase();
      movies = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.overview.toLowerCase().includes(q) ||
          m.genres.some((g) => g.toLowerCase().includes(q))
      );
    }

    if (genre) {
      movies = movies.filter((m) => m.genres.some((g) => g.toLowerCase() === String(genre).toLowerCase()));
    }

    if (language) {
      movies = movies.filter((m) => m.languages.some((l) => l.toLowerCase() === String(language).toLowerCase()));
    }

    if (country) {
      movies = movies.filter((m) => m.countries.some((c) => c.toLowerCase() === String(country).toLowerCase()));
    }

    if (year) {
      movies = movies.filter((m) => m.releaseDate.startsWith(String(year)));
    }

    if (rating) {
      movies = movies.filter((m) => m.rating >= Number(rating));
    }

    if (sortBy === 'rating') {
      movies.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'releaseDate') {
      movies.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
    } else if (sortBy === 'title') {
      movies.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // popularity default
      movies.sort((a, b) => b.voteCount - a.voteCount);
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const paginated = movies.slice(startIndex, startIndex + Number(limit));

    res.json({
      success: true,
      total: movies.length,
      page: Number(page),
      pages: Math.ceil(movies.length / Number(limit)),
      data: paginated,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMovieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const movie = await MovieService.getById(req.params.id);
    if (!movie) {
      res.status(404).json({ success: false, message: 'Movie not found' });
      return;
    }
    res.json({ success: true, data: movie });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = String(req.query.q || '');
    const movies = await TMDBService.searchMovies(query);
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMoviesByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await MovieService.getByGenre(req.params.genre);
    res.json({ success: true, genre: req.params.genre, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHollywoodMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await MovieService.getByIndustry('Hollywood');
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBollywoodMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const movies = await MovieService.getByIndustry('Bollywood');
    res.json({ success: true, count: movies.length, data: movies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSimilarMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const current = await MovieService.getById(req.params.id);
    const all = await MovieService.getAllMovies();
    const similar = all.filter(
      (m) => m.externalId !== req.params.id && (m.industry === current?.industry || m.genres.some((g) => current?.genres.includes(g)))
    );
    res.json({ success: true, count: similar.length, data: similar.slice(0, 8) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendedMovies = async (req: Request, res: Response): Promise<void> => {
  try {
    const all = await MovieService.getAllMovies();
    const recs = all.filter((m) => m.rating >= 8.0);
    res.json({ success: true, count: recs.length, data: recs.slice(0, 8) });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
