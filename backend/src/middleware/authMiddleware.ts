import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: any;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: 'Token is missing' });
    return;  // ✅ Exit function after response
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded;
    next();
  } catch (error) {
    const err = error as Error;  // ✅ Cast error to Error type
    res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
};

export default authMiddleware;
