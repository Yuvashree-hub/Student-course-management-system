// backend/middleware/authMiddleware.js
import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

// Verifies the Bearer JWT, loads the user and attaches it as req.user
export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication token is required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ success: false, message: 'JWT configuration is missing' });
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Role guard, use after authMiddleware: router.post('/', auth, restrictTo('admin'), ...)
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'You do not have permission to perform this action' });
    }
    next();
  };
