// backend/controllers/studentController.js
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../services/authService.js';

const canAccess = (req, id) => req.user.role === 'admin' || String(req.user._id) === String(id);

export const listStudents = asyncHandler(async (req, res) => {
  const filter = { role: 'student' };
  if (req.query.search) {
    const rx = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { department: rx }];
  }
  const students = await User.find(filter).sort({ createdAt: -1 });
  res.json({ count: students.length, students });
});

export const getStudent = asyncHandler(async (req, res) => {
  if (!canAccess(req, req.params.id)) throw new HttpError(403, 'You can only view your own profile');
  const student = await User.findById(req.params.id);
  if (!student) throw new HttpError(404, 'Student not found');
  res.json({ student });
});

export const updateStudent = asyncHandler(async (req, res) => {
  if (!canAccess(req, req.params.id)) throw new HttpError(403, 'You can only update your own profile');
  const student = await User.findById(req.params.id);
  if (!student) throw new HttpError(404, 'Student not found');

  // whitelist fields: role can never be changed through this endpoint
  for (const field of ['name', 'department', 'phone', 'studentId']) {
    if (req.body[field] !== undefined) student[field] = req.body[field];
  }
  if (req.body.email !== undefined) {
    const email = req.body.email.toLowerCase();
    const taken = await User.findOne({ email, _id: { $ne: student._id } });
    if (taken) throw new HttpError(409, 'Email is already registered');
    student.email = email;
  }
  if (req.body.password) student.passwordHash = await hashPassword(req.body.password);

  await student.save();
  res.json({ message: 'Student updated successfully', student });
});

export const deleteStudent = asyncHandler(async (req, res) => {
  if (!canAccess(req, req.params.id)) throw new HttpError(403, 'You can only delete your own account');
  const student = await User.findById(req.params.id);
  if (!student) throw new HttpError(404, 'Student not found');
  if (student.role === 'admin') throw new HttpError(403, 'Admin accounts cannot be deleted');

  await Promise.all([
    Enrollment.deleteMany({ studentId: student._id }),
    Notification.deleteMany({ userId: student._id }),
    Message.deleteMany({ $or: [{ from: student._id }, { to: student._id }] }),
    student.deleteOne(),
  ]);
  res.json({ message: 'Student deleted successfully' });
});
