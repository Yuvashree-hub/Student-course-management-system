// backend/routes/notificationRoutes.js
import express from 'express';
import { myNotifications, markRead, markAllRead, broadcast } from '../controllers/notificationController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', myNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.post('/broadcast', restrictTo('admin'), broadcast);

export default router;
