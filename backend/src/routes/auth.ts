import { Router } from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/register',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('role').optional().isIn(['STUDENT', 'LECTURER', 'ADMIN']),
    body('regNo').if(body('role').equals('STUDENT')).notEmpty().withMessage('Registration number required for students'),
    body('facultyId').if(body('role').equals('STUDENT')).notEmpty().withMessage('Faculty required for students'),
    body('departmentId').if(body('role').equals('STUDENT')).notEmpty().withMessage('Department required for students'),
    body('programme').if(body('role').equals('STUDENT')).notEmpty().withMessage('Programme required for students'),
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, me);
router.get('/verify/:userId', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
