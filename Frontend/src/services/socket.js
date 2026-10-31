// src/services/socket.js
// Single shared Socket.IO connection, authenticated with the JWT.
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
let socket = null;

export function connectSocket(token) {
  disconnectSocket();
  socket = io(SOCKET_URL, { auth: { token }, transports: ['websocket', 'polling'] });
  return socket;
}

export const getSocket = () => socket;

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
