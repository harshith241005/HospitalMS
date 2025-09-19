import express from 'express';
import { body } from 'express-validator';
import { register, getProfile } from '../controllers/authController.js';
import { login } from '../controllers/loginController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'doctor', 'patient']).withMessage('Valid role is required')
], register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get profile
router.get('/profile', authenticate, getProfile);

export default router;
