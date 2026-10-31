// backend/socket/index.js
// Socket.IO server: JWT-authenticated real-time chat, notifications and presence.
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { verifyToken } from '../utils/token.js';

let io = null;
const onlineCounts = new Map(); // userId -> number of open sockets (multiple tabs)

export const getOnlineUserIds = () => [...onlineCounts.keys()];
export const isOnline = (userId) => onlineCounts.has(String(userId));

export function emitToUser(userId, event, payload) {
  if (io) io.to(`user:${userId}`).emit(event, payload);
}

export function initSocket(httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
  });

  // Authenticate every socket connection with the same JWT used by the REST API
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication token required'));
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.sub);
      if (!user) return next(new Error('User no longer exists'));
      socket.user = { id: String(user._id), name: user.name, role: user.role };
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const { id: userId } = socket.user;
    socket.join(`user:${userId}`);

    onlineCounts.set(userId, (onlineCounts.get(userId) || 0) + 1);
    io.emit('presence:update', getOnlineUserIds());

    // ---- real-time chat ----
    socket.on('chat:send', async (payload, ack) => {
      const reply = typeof ack === 'function' ? ack : () => {};
      try {
        const to = payload?.to;
        const text = typeof payload?.text === 'string' ? payload.text.trim() : '';
        if (!to || !mongoose.isValidObjectId(to)) return reply({ ok: false, message: 'Invalid recipient' });
        if (String(to) === userId) return reply({ ok: false, message: 'You cannot message yourself' });
        if (!text || text.length > 1000) return reply({ ok: false, message: 'Message must be 1-1000 characters' });

        const recipient = await User.findById(to).select('_id');
        if (!recipient) return reply({ ok: false, message: 'Recipient not found' });

        const saved = await Message.create({ from: userId, to, text });
        const message = saved.toJSON();
        // deliver to recipient (all tabs) and echo to sender's other tabs
        io.to(`user:${to}`).emit('chat:message', message);
        io.to(`user:${userId}`).emit('chat:message', message);
        reply({ ok: true, message });
      } catch (err) {
        console.error('chat:send failed:', err.message);
        reply({ ok: false, message: 'Could not send message' });
      }
    });

    // ---- typing indicator ----
    socket.on('chat:typing', ({ to } = {}) => {
      if (to && mongoose.isValidObjectId(to)) {
        io.to(`user:${to}`).emit('chat:typing', { from: userId, name: socket.user.name });
      }
    });

    socket.on('disconnect', () => {
      const left = (onlineCounts.get(userId) || 1) - 1;
      if (left <= 0) onlineCounts.delete(userId);
      else onlineCounts.set(userId, left);
      io.emit('presence:update', getOnlineUserIds());
    });
  });

  return io;
}
