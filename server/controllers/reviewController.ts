import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import Review from '../models/Review.js';
import { MovieService } from '../services/movieService.js';

let memoryReviews: any[] = [
  {
    _id: 'rev_1',
    user: 'demo_user_1',
    userName: 'Alex Rivers',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    movie: '693134',
    movieTitle: 'Dune: Part Two',
    rating: 9.5,
    comment: 'A masterpiece of modern sci-fi cinema. The cinematography and Hans Zimmer score are mindblowing.',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'rev_2',
    user: 'demo_user_2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    movie: '872585',
    movieTitle: 'Oppenheimer',
    rating: 9.0,
    comment: 'Relentless pacing and superb performances by Cillian Murphy and Robert Downey Jr.',
    createdAt: new Date().toISOString()
  }
];

export const getMovieReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params;
    let reviews: any[] = [];

    try {
      reviews = await Review.find({ movie: movieId }).sort({ createdAt: -1 }).lean();
    } catch (e) {
      reviews = memoryReviews.filter((r) => r.movie === movieId);
    }

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: 'Must be logged in to review' });
      return;
    }

    if (!rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required' });
      return;
    }

    const movie = await MovieService.getById(movieId);
    const movieTitle = movie ? movie.title : 'Movie';

    let newReview: any;
    try {
      newReview = await Review.create({
        user: user.id,
        userName: user.name,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        movie: movieId,
        movieTitle,
        rating: Number(rating),
        comment,
      });
    } catch (e) {
      newReview = {
        _id: 'rev_' + Date.now(),
        user: user.id,
        userName: user.name,
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        movie: movieId,
        movieTitle,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
      };
      memoryReviews.unshift(newReview);
    }

    res.status(201).json({ success: true, data: newReview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    try {
      const updated = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });
      res.json({ success: true, data: updated });
    } catch (e) {
      const rev = memoryReviews.find((r) => r._id === reviewId);
      if (rev) {
        if (rating) rev.rating = rating;
        if (comment) rev.comment = comment;
      }
      res.json({ success: true, data: rev });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reviewId } = req.params;
    try {
      await Review.findByIdAndDelete(reviewId);
    } catch (e) {
      memoryReviews = memoryReviews.filter((r) => r._id !== reviewId);
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
