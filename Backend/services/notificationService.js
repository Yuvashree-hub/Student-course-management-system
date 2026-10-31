// backend/services/notificationService.js
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { emitToUser } from '../socket/index.js';

export async function notifyUser(userId, { title, message, type = 'info' }) {
  const doc = await Notification.create({ userId, title, message, type });
  emitToUser(userId, 'notification:new', doc.toJSON());
  return doc;
}

export async function notifyAllStudents({ title, message, type = 'announcement' }) {
  const students = await User.find({ role: 'student' }).select('_id');
  if (students.length === 0) return 0;
  const docs = await Notification.insertMany(
    students.map((s) => ({ userId: s._id, title, message, type }))
  );
  docs.forEach((d) => emitToUser(String(d.userId), 'notification:new', d.toJSON()));
  return docs.length;
}
