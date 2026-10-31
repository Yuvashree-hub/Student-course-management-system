// src/api/courseApi.js
import apiClient from './apiClient';

export const getCourses = async () => (await apiClient.get('/courses')).data;
export const createCourse = async (data) => (await apiClient.post('/courses', data)).data;
export const updateCourse = async (id, data) => (await apiClient.put(`/courses/${id}`, data)).data;
export const deleteCourse = async (id) => (await apiClient.delete(`/courses/${id}`)).data;
