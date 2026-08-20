import { Router } from 'express';
import {
  getGenres,
  createGenreAdmin,
  updateGenreAdmin,
  deleteGenreAdmin,
} from '../controllers/genreController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = Router();

router.get('/', getGenres);
router.post('/', protect, adminOnly, createGenreAdmin);
router.put('/:id', protect, adminOnly, updateGenreAdmin);
router.delete('/:id', protect, adminOnly, deleteGenreAdmin);

export default router;
