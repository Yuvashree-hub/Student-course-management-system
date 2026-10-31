// src/utils/storage.js
// Session helpers. sessionStorage is per-tab, so two tabs can be logged in as two
// different users at the same time (handy for testing the real-time chat).
const TOKEN_KEY = 'token';
const USER_KEY = 'acadexa_user';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const saveUser = (user) => sessionStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};
