// src/store/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as courseApi from '../api/courseApi';
import { errorMessage } from '../utils/format';
import { logout } from './authSlice';

export const fetchCourses = createAsyncThunk('courses/fetch', async (_, { rejectWithValue }) => {
  try {
    return (await courseApi.getCourses()).courses;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const addCourse = createAsyncThunk('courses/add', async (data, { rejectWithValue }) => {
  try {
    return (await courseApi.createCourse(data)).course;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const editCourse = createAsyncThunk('courses/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    return (await courseApi.updateCourse(id, data)).course;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

export const removeCourse = createAsyncThunk('courses/remove', async (id, { rejectWithValue }) => {
  try {
    await courseApi.deleteCourse(id);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: { list: [], loading: false, error: null, loaded: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCourses.fulfilled, (s, a) => { s.loading = false; s.loaded = true; s.list = a.payload; })
      .addCase(fetchCourses.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(addCourse.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(editCourse.fulfilled, (s, a) => {
        s.list = s.list.map((c) => (c.id === a.payload.id ? a.payload : c));
      })
      .addCase(removeCourse.fulfilled, (s, a) => { s.list = s.list.filter((c) => c.id !== a.payload); })
      .addCase(logout, (s) => { s.error = null; });
  },
});

export default courseSlice.reducer;
