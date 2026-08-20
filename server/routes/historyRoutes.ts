import { Router } from 'express';
import {
  getWatchHistory,
  updateWatchProgress,
  deleteWatchHistoryItem,
} from '../controllers/historyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getWatchHistory);
router.post('/', updateWatchProgress);
router.put('/:movieId', updateWatchProgress);
router.delete('/:movieId', deleteWatchHistoryItem);

export default router;
