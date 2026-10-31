// backend/utils/asyncHandler.js
// Wraps async route handlers so rejected promises go to the central error handler.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
