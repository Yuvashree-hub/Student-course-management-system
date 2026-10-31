// src/utils/format.js
export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

export const errorMessage = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message ||
  (err?.code === 'ERR_NETWORK' ? 'Cannot reach the server. Is the backend running?' : err?.message) ||
  fallback;
