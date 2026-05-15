import express from 'express';
import serviceCategoryController from './serviceCategory.controller.js';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', serviceCategoryController.getAll);
router.get('/:id', serviceCategoryController.getById);
router.get('/slug/:slug', serviceCategoryController.getBySlug);

// Admin routes (protected)
router.post('/', authenticateToken, authorizeRole('admin'), serviceCategoryController.create);
router.put('/:id', authenticateToken, authorizeRole('admin'), serviceCategoryController.update);
router.patch('/:id/toggle-status', authenticateToken, authorizeRole('admin'), serviceCategoryController.toggleStatus);
router.delete('/:id', authenticateToken, authorizeRole('admin'), serviceCategoryController.delete);

export default router;
