// src/api/notificationApi.js
import apiClient from './apiClient';

export const getNotifications = async () => (await apiClient.get('/notifications')).data;
export const markNotificationRead = async (id) => (await apiClient.patch(`/notifications/${id}/read`)).data;
export const markAllNotificationsRead = async () => (await apiClient.patch('/notifications/read-all')).data;
export const broadcastNotification = async (data) => (await apiClient.post('/notifications/broadcast', data)).data;
