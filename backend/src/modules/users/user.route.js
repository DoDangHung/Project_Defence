const express = require('express');
const router = express.Router();
const userController = require('../users/user.controller.js');

// Middleware validation (optional - có thể thêm sau)
// const { validateAdmin, validateDoctor, validatePatient, validateNurse } = require('../middleware/validation');

// Statistics route (đặt trước các dynamic routes)
router.get('/statistics', userController.getUserStatistics);

// Get all users và get user by ID
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);

// Create users by role
router.post('/admin', userController.createAdmin);
router.post('/doctor', userController.createDoctor);
router.post('/patient', userController.createPatient);
router.post('/nurse', userController.createNurse);

// Update user
router.put('/:id', userController.updateUser);
router.put('/:id/password', userController.changePassword);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
