// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../api/authApi';
import * as studentApi from '../api/studentApi';
import { saveSession, saveUser, clearSession, getToken, getStoredUser } from '../utils/storage';
import { errorMessage } from '../utils/format';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const data = await authApi.loginStudent(credentials);
    saveSession(data.token, data.user);
    return { token: data.token, user: data.user };
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Login failed. Please check your credentials.'));
  }
});

export const registerUser = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    return await authApi.registerStudent(payload);
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Registration failed.'));
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await studentApi.updateStudent(id, data);
    saveUser(res.student);
    return res.student;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Could not update profile.'));
  }
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (id, { rejectWithValue }) => {
  try {
    await studentApi.deleteStudent(id);
    clearSession();
    return true;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Could not delete account.'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: getToken(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      clearSession();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
      .addCase(loginUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(registerUser.fulfilled, (s) => { s.loading = false; })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(updateProfile.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(updateProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(deleteAccount.fulfilled, (s) => { s.user = null; s.token = null; })
      .addCase(deleteAccount.rejected, (s, a) => { s.error = a.payload; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
