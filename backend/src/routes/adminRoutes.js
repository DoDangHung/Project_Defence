import express from 'express';
import userController from '../modules/users/user.controller.js';
import {
  authenticateToken,
  checkAdminRole,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Tất cả routes dưới này yêu cầu authentication + admin role
router.use(authenticateToken);
router.use(checkAdminRole);

// GET /api/admin/users
router.get('/users', userController.getAllUsers);
router.get('/users/admins', userController.getAllAdmins);
router.get('/users/doctors', userController.getAllDoctors);
router.get('/users/patients', userController.getAllPatients);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);

// POST /api/admin/users
router.post('/users/doctor', userController.createDoctor);
router.post('/users/patient', userController.createPatient);
router.post('/users/admin', userController.createAdmin);

// PUT /api/admin/users/:id
router.put('/users/:id', userController.updateUser);

// DELETE /api/admin/users/:id
router.delete('/users/:id', userController.deleteUser);

export default router;
