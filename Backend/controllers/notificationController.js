// backend/controllers/notificationController.js
import Notification from '../models/Notification.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { notifyAllStudents } from '../services/notificationService.js';

export const myNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
  const unread = await Notification.countDocuments({ userId: req.user._id, read: false });
  res.json({ notifications, unread });
});

export const markRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { read: true }, { new: true });
  if (!n) throw new HttpError(404, 'Notification not found');
  res.json({ notification: n });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

// Admin: send an announcement to every student, delivered instantly over Socket.IO
export const broadcast = asyncHandler(async (req, res) => {
  const { title, message } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || typeof message !== 'string' || !message.trim()) {
    throw new HttpError(400, 'Title and message are required');
  }
  const sent = await notifyAllStudents({ title: title.slice(0, 120), message: message.slice(0, 500), type: 'announcement' });
  res.status(201).json({ message: `Announcement sent to ${sent} student(s)`, sent });
});
