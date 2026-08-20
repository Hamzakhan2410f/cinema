import { Router } from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  addCustomMovieAdmin,
  updateMovieAdmin,
  deleteMovieAdmin,
  uploadMediaAdmin,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id', updateUserAdmin);
router.delete('/users/:id', deleteUserAdmin);

router.post('/movies', addCustomMovieAdmin);
router.put('/movies/:id', updateMovieAdmin);
router.delete('/movies/:id', deleteMovieAdmin);

router.post('/upload', uploadMediaAdmin);

export default router;

