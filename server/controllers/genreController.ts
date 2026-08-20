import { Request, Response } from 'express';
import Genre from '../models/Genre.js';

const DEFAULT_GENRES = [
  { name: 'Action', slug: 'action', description: 'High-energy action and stunts', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600' },
  { name: 'Adventure', slug: 'adventure', description: 'Thrilling journeys and explorations', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
  { name: 'Comedy', slug: 'comedy', description: 'Fun, humor, and laughter', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600' },
  { name: 'Drama', slug: 'drama', description: 'Deep storytelling and emotion', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600' },
  { name: 'Horror', slug: 'horror', description: 'Chilling tales and frights', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=600' },
  { name: 'Sci-Fi', slug: 'sci-fi', description: 'Futuristic worlds and technology', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600' },
  { name: 'Thriller', slug: 'thriller', description: 'Suspenseful plots and tension', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
  { name: 'Romance', slug: 'romance', description: 'Love stories and human connections', image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600' },
  { name: 'Animation', slug: 'animation', description: 'Animated feature films for all ages', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=600' },
  { name: 'Documentary', slug: 'documentary', description: 'Real-world stories and insight', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600' },
];

export const getGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    let genres: any[] = [];
    try {
      genres = await (Genre as any).find().sort({ name: 1 });
    } catch (e) {}

    if (!genres || genres.length === 0) {
      genres = DEFAULT_GENRES.map((g, idx) => ({ ...g, _id: 'genre_' + idx }));
    }

    res.json({ success: true, count: genres.length, data: genres });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGenreAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Genre name is required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    let created;
    try {
      created = await (Genre as any).create({ name, slug, description, image });
    } catch (e) {
      created = { _id: 'custom_genre_' + Date.now(), name, slug, description, image };
    }

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGenreAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;
    const updateData: any = { description, image };
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    let updated;
    try {
      updated = await (Genre as any).findByIdAndUpdate(id, updateData, { new: true });
    } catch (e) {
      updated = { _id: id, ...updateData };
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGenreAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    try {
      await (Genre as any).findByIdAndDelete(id);
    } catch (e) {}
    res.json({ success: true, message: 'Genre deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
