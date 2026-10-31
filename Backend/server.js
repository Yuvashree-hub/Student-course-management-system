// backend/server.js
import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables BEFORE importing modules that read them
dotenv.config();

const { connectDB } = await import('./config/db.js');
const { default: apiRoutes } = await import('./routes/index.js');
const { getHomeStatus } = await import('./controllers/healthController.js');
const { errorHandler, notFound } = await import('./middleware/errorMiddleware.js');
const { sanitizeInput } = await import('./middleware/sanitize.js');
const { requestLogger } = await import('./middleware/logger.js');
const { initSocket } = await import('./socket/index.js');

const app = express();
const server = http.createServer(app);

// ---- CORS: only the configured frontend origin(s) may call the API ----
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' })); // JSON body parsing
app.use(requestLogger);
app.use(sanitizeInput);

// GET /  -> server status
app.get('/', getHomeStatus);

// API routes (GET /api/health, /api/auth/*, /api/students/*, ...). /api/v1 kept as an alias.
app.use('/api', apiRoutes);
app.use('/api/v1', apiRoutes);

// 404 + centralized error handling
app.use(notFound);
app.use(errorHandler);

// Real-time layer (Socket.IO)
initSocket(server, allowedOrigins);

const PORT = process.env.PORT || 5000;

await connectDB();
server.listen(PORT, () => {
  console.log(`🚀 ACADEXA Backend running at http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
  console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
});

// Don't crash the whole process on a stray rejected promise
process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));
