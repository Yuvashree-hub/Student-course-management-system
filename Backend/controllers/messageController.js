// backend/controllers/messageController.js
import mongoose from 'mongoose';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { HttpError } from '../utils/HttpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { isOnline } from '../socket/index.js';

// People the current user can chat with (everyone except themselves)
export const contacts = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('name email role department').sort({ role: 1, name: 1 });
  res.json({ contacts: users.map((u) => ({ ...u.toJSON(), online: isOnline(u._id) })) });
});

export const conversation = asyncHandler(async (req, res) => {
  const other = req.params.userId;
  if (!mongoose.isValidObjectId(other)) throw new HttpError(400, 'Invalid user id');
  const messages = await Message.find({
    $or: [
      { from: req.user._id, to: other },
      { from: other, to: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .limit(300);
  res.json({ messages });
});
