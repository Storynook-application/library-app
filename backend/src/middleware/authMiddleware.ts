import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface DecodedToken extends JwtPayload {
  userId: number;
  email: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    // attach user info to request if needed
    (req as any).user = { userId: decoded.userId, email: decoded.email };

    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE ERROR]', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
