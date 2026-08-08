import { Router } from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  addCustomMovieAdmin,
  updateMovieAdmin,
  deleteMovieAdmin,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.post('/movies', addCustomMovieAdmin);
router.put('/movies/:id', updateMovieAdmin);
router.delete('/movies/:id', deleteMovieAdmin);

export default router;
