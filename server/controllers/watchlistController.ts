import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Watchlist from '../models/Watchlist.js';
import { MovieService } from '../services/movieService.js';

// In-memory fallback watchlist store when DB is offline
const memoryWatchlists: Record<string, string[]> = {};

export const getWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    let movieIds: string[] = [];

    try {
      const items = await Watchlist.find({ user: userId });
      movieIds = items.map((i) => i.movie);
    } catch (e) {
      movieIds = memoryWatchlists[userId] || ['693134', '872585'];
    }

    const allMovies = await MovieService.getAllMovies();
    const watchlistMovies = allMovies.filter((m) => movieIds.includes(m.externalId));

    res.json({ success: true, count: watchlistMovies.length, data: watchlistMovies });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { movieId } = req.params;

    try {
      await Watchlist.create({ user: userId, movie: movieId });
    } catch (e) {
      if (!memoryWatchlists[userId]) memoryWatchlists[userId] = [];
      if (!memoryWatchlists[userId].includes(movieId)) {
        memoryWatchlists[userId].push(movieId);
      }
    }

    res.status(201).json({ success: true, message: 'Added to watchlist', movieId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { movieId } = req.params;

    try {
      await Watchlist.deleteOne({ user: userId, movie: movieId });
    } catch (e) {
      if (memoryWatchlists[userId]) {
        memoryWatchlists[userId] = memoryWatchlists[userId].filter((id) => id !== movieId);
      }
    }

    res.json({ success: true, message: 'Removed from watchlist', movieId });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
