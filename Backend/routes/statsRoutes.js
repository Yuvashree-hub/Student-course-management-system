// backend/routes/statsRoutes.js
import express from 'express';
import { adminStats } from '../controllers/statsController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', authMiddleware, restrictTo('admin'), adminStats);

export default router;
