// src/api/studentApi.js
import apiClient from './apiClient';

export const getStudents = async (search = '') =>
  (await apiClient.get('/students', { params: search ? { search } : {} })).data;
export const getStudent = async (id) => (await apiClient.get(`/students/${id}`)).data;
export const updateStudent = async (id, data) => (await apiClient.put(`/students/${id}`, data)).data;
export const deleteStudent = async (id) => (await apiClient.delete(`/students/${id}`)).data;
