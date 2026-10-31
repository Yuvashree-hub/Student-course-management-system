// src/api/chatApi.js
import apiClient from './apiClient';

export const getContacts = async () => (await apiClient.get('/messages/contacts')).data;
export const getConversation = async (userId) => (await apiClient.get(`/messages/${userId}`)).data;
export const getAdminStats = async () => (await apiClient.get('/stats')).data;
