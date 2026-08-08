import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'cinema_jwt_secret_key_2026_super_secure';
  return jwt.sign({ id, role }, secret, {
    expiresIn: '30d',
  });
};
