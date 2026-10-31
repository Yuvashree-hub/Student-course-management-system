// backend/middleware/sanitize.js
// Basic NoSQL-injection protection + whitespace trimming for incoming input.
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue; // drop operator-like keys
      out[key] = clean(val);
    }
    return out;
  }
  return typeof value === 'string' ? value.trim() : value;
}

export function sanitizeInput(req, _res, next) {
  if (req.body) req.body = clean(req.body);
  if (req.params) req.params = clean(req.params);
  if (req.query) {
    const cleaned = clean(req.query);
    for (const k of Object.keys(req.query)) delete req.query[k];
    Object.assign(req.query, cleaned);
  }
  next();
}
