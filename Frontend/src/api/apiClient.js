// src/api/apiClient.js
import axios from 'axios';
import { getToken, clearSession } from '../utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach the JWT to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is rejected, clear the session and send the user to login
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthCall = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (error.response?.status === 401 && getToken() && !isAuthCall) {
      clearSession();
      window.location.assign('/login?expired=1');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
