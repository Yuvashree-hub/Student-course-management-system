// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import courseReducer from './courseSlice';
import enrollmentReducer from './enrollmentSlice';
import notificationReducer from './notificationSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    enrollments: enrollmentReducer,
    notifications: notificationReducer,
    chat: chatReducer,
  },
});
