// backend/routes/studentRoutes.js
import express from 'express';
import { listStudents, getStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import authMiddleware, { restrictTo } from '../middleware/authMiddleware.js';
import { validateStudentUpdate } from '../middleware/authValidation.js';

const router = express.Router();
router.use(authMiddleware); // every student route is protected

router.get('/', restrictTo('admin'), listStudents);
router.get('/:id', getStudent);
router.put('/:id', validateStudentUpdate, updateStudent);
router.patch('/:id', validateStudentUpdate, updateStudent);
router.delete('/:id', deleteStudent);

export default router;
