// backend/controllers/statsController.js
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getOnlineUserIds } from '../socket/index.js';

export const adminStats = asyncHandler(async (_req, res) => {
  const [students, courses, enrollments, completed] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ status: 'Completed' }),
  ]);
  res.json({ students, courses, enrollments, completed, onlineUsers: getOnlineUserIds().length });
});
