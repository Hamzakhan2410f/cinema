import { Response } from 'express';
import WatchHistory from '../models/WatchHistory.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Movie from '../models/Movie.js';
import { TMDBService } from '../services/tmdbService.js';

export const getWatchHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    let history: any[] = [];
    try {
      history = await (WatchHistory as any)
        .find({ user: userId })
        .sort({ lastWatchedAt: -1 })
        .limit(20);
    } catch (e) {}

    // Populate movie details for history items
    const enrichedHistory = await Promise.all(
      history.map(async (item) => {
        let movieDetails = null;
        try {
          movieDetails = await (Movie as any).findOne({ externalId: item.movieId });
        } catch (e) {}

        if (!movieDetails) {
          try {
            movieDetails = await TMDBService.getMovieDetails(item.movieId);
          } catch (e) {}
        }

        return {
          _id: item._id,
          movieId: item.movieId,
          progress: item.progress,
          duration: item.duration,
          percentage: item.percentage,
          completed: item.completed,
          lastWatchedAt: item.lastWatchedAt,
          movie: movieDetails,
        };
      })
    );

    res.json({ success: true, count: enrichedHistory.length, data: enrichedHistory });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWatchProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { movieId, progress = 0, duration = 0 } = req.body;

    if (!movieId) {
      res.status(400).json({ success: false, message: 'Movie ID is required' });
      return;
    }

    const percentage = duration > 0 ? Math.min(100, Math.round((progress / duration) * 100)) : 0;
    const completed = percentage >= 90;

    let updated;
    try {
      updated = await (WatchHistory as any).findOneAndUpdate(
        { user: userId, movieId: String(movieId) },
        {
          progress,
          duration,
          percentage,
          completed,
          lastWatchedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (e) {
      updated = { user: userId, movieId, progress, duration, percentage, completed, lastWatchedAt: new Date() };
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWatchHistoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'demo_user';
    const { movieId } = req.params;
    try {
      await (WatchHistory as any).deleteOne({ user: userId, movieId });
    } catch (e) {}

    res.json({ success: true, message: 'Removed from watch history' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
