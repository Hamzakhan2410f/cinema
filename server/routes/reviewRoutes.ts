import { Router } from 'express';
import { getMovieReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/:movieId', getMovieReviews);
router.post('/:movieId', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;
