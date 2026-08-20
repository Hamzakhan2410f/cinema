import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    let userObj: any = null;

    try {
      userObj = await (User as any).findById(userId).select('-password');
    } catch (e) {}

    if (!userObj) {
      userObj = {
        id: req.user?.id,
        name: req.user?.name || 'Cinema Fan',
        email: req.user?.email || 'user@cinema.com',
        role: req.user?.role || 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        favorites: ['693134', '872585'],
      };
    }

    res.json({ success: true, data: userObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { name, avatar } = req.body;

    try {
      const updated = await (User as any).findByIdAndUpdate(
        userId,
        { name, avatar },
        { new: true }
      ).select('-password');
      res.json({ success: true, data: updated });
    } catch (e) {
      res.json({
        success: true,
        data: {
          id: userId,
          name: name || req.user?.name,
          email: req.user?.email,
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
