// src/store/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificationApi from '../api/notificationApi';
import { errorMessage } from '../utils/format';
import { logout } from './authSlice';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (_, { rejectWithValue }) => {
  try {
    return await notificationApi.getNotifications();
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const readNotification = createAsyncThunk('notifications/read', async (id, { rejectWithValue }) => {
  try {
    await notificationApi.markNotificationRead(id);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const readAllNotifications = createAsyncThunk('notifications/readAll', async (_, { rejectWithValue }) => {
  try {
    await notificationApi.markAllNotificationsRead();
    return true;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const initial = { list: [], unread: 0, loading: false, error: null, toast: null };

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initial,
  reducers: {
    // called when a "notification:new" socket event arrives (real time, no refresh)
    addNotification: (state, action) => {
      if (state.list.some((n) => n.id === action.payload.id)) return;
      state.list.unshift(action.payload);
      state.unread += 1;
      state.toast = action.payload;
    },
    clearToast: (state) => { state.toast = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload.notifications;
        s.unread = a.payload.unread;
      })
      .addCase(fetchNotifications.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(readNotification.fulfilled, (s, a) => {
        const n = s.list.find((x) => x.id === a.payload);
        if (n && !n.read) { n.read = true; s.unread = Math.max(0, s.unread - 1); }
      })
      .addCase(readAllNotifications.fulfilled, (s) => {
        s.list.forEach((n) => { n.read = true; });
        s.unread = 0;
      })
      .addCase(logout, () => initial);
  },
});

export const { addNotification, clearToast } = notificationSlice.actions;
export default notificationSlice.reducer;
