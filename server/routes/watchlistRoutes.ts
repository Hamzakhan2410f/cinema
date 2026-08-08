import { Router } from 'express';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getWatchlist);
router.post('/:movieId', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);

export default router;
