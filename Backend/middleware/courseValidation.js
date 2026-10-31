// backend/middleware/courseValidation.js
import { HttpError } from '../utils/HttpError.js';

function check(body, requireAll) {
  const { title, description, duration, instructor } = body || {};
  const fields = { title, description, duration };
  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined) {
      if (requireAll) return `${key} is required`;
      continue;
    }
    if (typeof val !== 'string' || !val.trim()) return `${key} must be a non-empty text`;
  }
  if (title !== undefined && (title.length < 3 || title.length > 120)) return 'Title must be 3-120 characters';
  if (description !== undefined && description.length > 1000) return 'Description is too long (max 1000)';
  if (instructor !== undefined && typeof instructor !== 'string') return 'Instructor must be text';
  return null;
}

export const validateCourseCreate = (req, _res, next) => {
  const msg = check(req.body, true);
  return msg ? next(new HttpError(400, msg)) : next();
};

export const validateCourseUpdate = (req, _res, next) => {
  const msg = check(req.body, false);
  return msg ? next(new HttpError(400, msg)) : next();
};
