import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;

  // A linha abaixo foi atualizada para usar optional chaining (?.)
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        'SEU_SEGREDO_SUPER_SECRETO'
      ) as { userId: number };
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else { // Adicionado um 'else' para maior clareza
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};