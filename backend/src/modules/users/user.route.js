import express from 'express';
import userController from './user.controller.js';
import { uploadAvatar } from '../../config/multer.js';
const router = express.Router();

// Statistics route (đặt trước các dynamic routes)
router.get('/statistics', userController.getUserStatistics);

// Get all by role (đặt trước :id)
router.get('/admins', userController.getAllAdmins);
router.get('/doctors', userController.getAllDoctors);
router.get('/patients', userController.getAllPatients);

// Get all users và get user by ID
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

// Create users by role
router.post('/admin', userController.createAdmin);
router.post('/doctor', userController.createDoctor);
router.post('/patient', userController.createPatient);

// Update user
router.put('/:id', uploadAvatar.single('avatar'), userController.updateUser);
router.put('/:id/password', userController.changePassword);

// Delete user
router.delete('/:id', userController.deleteUser);

export default router;
