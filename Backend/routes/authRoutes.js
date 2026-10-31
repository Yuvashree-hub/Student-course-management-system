// backend/routes/authRoutes.js
import express from 'express';
import { register, login, me } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/authValidation.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/me', authMiddleware, me);

export default router;
