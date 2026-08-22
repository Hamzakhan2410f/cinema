import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db.js';
import authRoutes from './server/routes/authRoutes.js';
import movieRoutes from './server/routes/movieRoutes.js';
import genreRoutes from './server/routes/genreRoutes.js';
import historyRoutes from './server/routes/historyRoutes.js';
import watchlistRoutes from './server/routes/watchlistRoutes.js';
import reviewRoutes from './server/routes/reviewRoutes.js';
import userRoutes from './server/routes/userRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import { errorHandler } from './server/middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Trust reverse proxy (Cloud Run, Nginx, Vercel, Render)
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Security and middleware setup
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(express.json());

// Rate Limiting configured for proxies
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    trustProxy: false,
    xForwardedForHeader: false,
  },
});

app.use('/api', apiLimiter);

// Mount API Routes
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    app: 'CINEMA API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler Middleware
app.use('/api', errorHandler);

// Start server and handle Vite frontend
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🎬 CINEMA Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
