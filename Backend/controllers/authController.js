// backend/controllers/authController.js
import { registerStudent, loginUser } from '../services/authService.js';
import { signToken } from '../utils/token.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const student = await registerStudent(req.body);
  res.status(201).json({ message: 'Student registered successfully', student });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const { token, expiresIn } = signToken({ _id: user.id, email: user.email, role: user.role });
  res.status(200).json({
    message: 'Login successful',
    token,
    tokenType: 'Bearer',
    expiresIn,
    student: user, // kept as "student" for frontend compatibility; admins use it too
    user,
  });
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user.toJSON() });
});
