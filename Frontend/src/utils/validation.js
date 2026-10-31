// src/utils/validation.js
// Reusable client-side validators. Each returns an error string, or '' when valid.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,15}$/;

export const validateRequired = (v, label = 'This field') => (String(v ?? '').trim() ? '' : `${label} is required`);

export const validateName = (v) => {
  if (!String(v ?? '').trim()) return 'Full name is required';
  if (v.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const validateEmail = (v) => {
  if (!String(v ?? '').trim()) return 'Email is required';
  if (!EMAIL_RE.test(v.trim())) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (v) => {
  if (!v) return 'Password is required';
  if (v.length < 8) return 'Password must be at least 8 characters';
  if (v.length > 72) return 'Password must be at most 72 characters';
  return '';
};

export const validatePhone = (v, required = false) => {
  if (!String(v ?? '').trim()) return required ? 'Phone number is required' : '';
  if (!PHONE_RE.test(v.trim())) return 'Enter a valid phone number (7-15 digits)';
  return '';
};

export const validateConfirm = (password, confirm) => {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

// ---- form-level validators: return { field: message } ----
export const validateLoginForm = ({ email, password }) => ({
  email: validateEmail(email),
  password: validateRequired(password, 'Password'),
});

export const validateRegisterForm = (v) => ({
  fullName: validateName(v.fullName),
  studentId: validateRequired(v.studentId, 'Student ID'),
  email: validateEmail(v.email),
  phone: validatePhone(v.phone, true),
  department: validateRequired(v.department, 'Department'),
  password: validatePassword(v.password),
  confirmPassword: validateConfirm(v.password, v.confirmPassword),
});

export const validateProfileForm = (v) => ({
  name: validateName(v.name),
  phone: validatePhone(v.phone),
  password: v.password ? validatePassword(v.password) : '',
});

export const validateCourseForm = (v) => ({
  title: !v.title?.trim() ? 'Title is required' : v.title.trim().length < 3 ? 'Title must be at least 3 characters' : '',
  duration: validateRequired(v.duration, 'Duration'),
  description: validateRequired(v.description, 'Description'),
});
