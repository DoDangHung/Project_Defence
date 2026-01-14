import express from 'express';
import authController from './auth.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

router.post('/register', authController.register);
// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.post('/logout', authenticateToken, authController.logout);

export default router;
