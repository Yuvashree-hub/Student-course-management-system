import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket } from '../services/socket';
import { addNotification, fetchNotifications } from '../store/notificationSlice';
import { receiveMessage, setConnected, setOnline } from '../store/chatSlice';

// Invisible component: keeps ONE authenticated Socket.IO connection open while logged in
// and forwards server events into the Redux store (so the UI updates without a refresh).
export default function RealtimeBridge() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const userId = useSelector((s) => s.auth.user?.id);

  useEffect(() => {
    if (!token || !userId) {
      disconnectSocket();
      dispatch(setConnected(false));
      return undefined;
    }

    dispatch(fetchNotifications());
    const socket = connectSocket(token);

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));
    socket.on('connect_error', (err) => console.warn('Socket error:', err.message));
    socket.on('presence:update', (ids) => dispatch(setOnline(ids)));
    socket.on('notification:new', (n) => dispatch(addNotification(n)));
    socket.on('chat:message', (message) => dispatch(receiveMessage({ message, myId: userId })));

    return () => disconnectSocket();
  }, [token, userId, dispatch]);

  return null;
}
