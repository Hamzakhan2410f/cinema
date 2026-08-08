import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'cinema_jwt_secret_key_2026_super_secure';
    const decoded = jwt.verify(token, secret) as { id: string; role: string };

    // Attempt Mongo fetch, fallback to decoded info
    let user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } else {
      // In-memory or demo user fallback
      req.user = {
        id: decoded.id,
        email: 'user@cinema.com',
        name: 'Cinema Member',
        role: decoded.role || 'user',
      };
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};
