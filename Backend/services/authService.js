// backend/services/authService.js
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { HttpError } from '../utils/HttpError.js';

export async function registerStudent({ name, email, password, department, phone, studentId }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) throw new HttpError(409, 'Email is already registered');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department?.trim() || '',
    phone: phone?.trim() || '',
    studentId: studentId?.trim() || '',
    role: 'student', // public registration can never create an admin
  });
  return user.toJSON();
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  // same message for unknown email / wrong password (no user enumeration)
  const invalid = new HttpError(401, 'Invalid email or password');
  if (!user) throw invalid;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw invalid;
  return user.toJSON();
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
