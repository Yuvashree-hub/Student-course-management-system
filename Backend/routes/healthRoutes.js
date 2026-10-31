import express from 'express';
import { getHomeStatus, getHealthStatus } from '../controllers/healthController.js';

const router = express.Router();

// GET / → Server status
router.get('/', getHomeStatus);

// GET /api/health → API health status
router.get('/health', getHealthStatus);

export default router;