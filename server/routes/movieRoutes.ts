import { Router } from 'express';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovies,
  getMovieById,
  getMovieVideos,
  getMovieFullVideo,
  searchMovies,
  getMoviesByGenre,
  getHollywoodMovies,
  getBollywoodMovies,
  getSimilarMovies,
  getRecommendedMovies,
  incrementMovieView,
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
router.get('/:id/videos', getMovieVideos);
router.get('/:id/trailer', getMovieVideos);
router.get('/:id/video', getMovieFullVideo);
router.post('/:id/view', incrementMovieView);
router.get('/:id/similar', getSimilarMovies);
router.get('/:id/recommendations', getRecommendedMovies);
router.get('/:id', getMovieById);
router.get('/', getMovies);

export default router;
