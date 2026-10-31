// backend/routes/messageRoutes.js
import express from 'express';
import { contacts, conversation } from '../controllers/messageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/contacts', contacts);
router.get('/:userId', conversation);

export default router;
