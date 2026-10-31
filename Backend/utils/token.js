// backend/utils/token.js
import jwt from 'jsonwebtoken';

export function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, {
    subject: String(user._id),
    expiresIn,
  });
  return { token, expiresIn };
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
