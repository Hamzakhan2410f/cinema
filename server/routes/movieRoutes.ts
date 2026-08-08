import { Router } from 'express';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovies,
  getMovieById,
  searchMovies,
  getMoviesByGenre,
  getHollywoodMovies,
  getBollywoodMovies,
  getSimilarMovies,
  getRecommendedMovies,
} from '../controllers/movieController.js';

const router = Router();

router.get('/trending', getTrendingMovies);
router.get('/popular', getPopularMovies);
router.get('/top-rated', getTopRatedMovies);
router.get('/upcoming', getUpcomingMovies);
router.get('/search', searchMovies);
router.get('/genre/:genre', getMoviesByGenre);
router.get('/hollywood', getHollywoodMovies);
router.get('/bollywood', getBollywoodMovies);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id/recommendations', getRecommendedMovies);
router.get('/:id', getMovieById);
router.get('/', getMovies);

export default router;
