// src/api/enrollmentApi.js
import apiClient from './apiClient';

export const getMyEnrollments = async () => (await apiClient.get('/enrollments/me')).data;
export const enrollInCourse = async (courseId) => (await apiClient.post('/enrollments', { courseId })).data;
export const setProgress = async (id, progress) => (await apiClient.patch(`/enrollments/${id}`, { progress })).data;
export const unenrollFromCourse = async (id) => (await apiClient.delete(`/enrollments/${id}`)).data;
