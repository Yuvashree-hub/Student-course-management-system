// src/store/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatApi from '../api/chatApi';
import { errorMessage } from '../utils/format';
import { logout } from './authSlice';

export const fetchContacts = createAsyncThunk('chat/contacts', async (_, { rejectWithValue }) => {
  try {
    return (await chatApi.getContacts()).contacts;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const fetchConversation = createAsyncThunk('chat/conversation', async (userId, { rejectWithValue }) => {
  try {
    return { userId, messages: (await chatApi.getConversation(userId)).messages };
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const initial = {
  contacts: [],
  messages: {}, // { [otherUserId]: Message[] }
  unread: {}, // { [otherUserId]: number }
  online: [], // ids of users currently connected
  activeId: null,
  connected: false,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: initial,
  reducers: {
    setConnected: (s, a) => { s.connected = a.payload; },
    setOnline: (s, a) => { s.online = a.payload; },
    setActiveChat: (s, a) => {
      s.activeId = a.payload;
      if (a.payload) delete s.unread[a.payload];
    },
    // payload: { message, myId } - used for both sent and received messages
    receiveMessage: (s, a) => {
      const { message, myId } = a.payload;
      const otherId = message.from === myId ? message.to : message.from;
      const thread = s.messages[otherId] || (s.messages[otherId] = []);
      if (thread.some((m) => m.id === message.id)) return;
      thread.push(message);
      if (message.from !== myId && s.activeId !== otherId) {
        s.unread[otherId] = (s.unread[otherId] || 0) + 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchContacts.fulfilled, (s, a) => {
        s.loading = false;
        s.contacts = a.payload;
        // seed online list from the REST response (socket updates keep it fresh afterwards)
        const fromApi = a.payload.filter((c) => c.online).map((c) => c.id);
        s.online = Array.from(new Set([...s.online, ...fromApi]));
      })
      .addCase(fetchContacts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchConversation.fulfilled, (s, a) => {
        const existing = s.messages[a.payload.userId] || [];
        const merged = [...a.payload.messages];
        existing.forEach((m) => { if (!merged.some((x) => x.id === m.id)) merged.push(m); });
        merged.sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt));
        s.messages[a.payload.userId] = merged;
      })
      .addCase(logout, () => initial);
  },
});

export const { setConnected, setOnline, setActiveChat, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;
