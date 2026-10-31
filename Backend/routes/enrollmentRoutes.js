// backend/routes/enrollmentRoutes.js
import express from 'express';
import { enroll, myEnrollments, updateProgress, unenroll, allEnrollments } from '../controllers/enrollmentController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/', restrictTo('admin'), allEnrollments);
router.get('/me', myEnrollments);
router.post('/', restrictTo('student'), enroll);
router.patch('/:id', restrictTo('student'), updateProgress);
router.delete('/:id', restrictTo('student'), unenroll);

export default router;
