const specialtyController = require('../../modules/specialty/specialty.controller');
const express = require('express');
const router = express.Router();

// const { authenticate, authorize } = require('../middleware/auth'); // Nếu có auth

// Public routes
router.get('/', specialtyController.getAllSpecialties);
router.get('/popular', specialtyController.getPopularSpecialties);
router.get('/slug/:slug', specialtyController.getSpecialtyBySlug);
router.get('/:id', specialtyController.getSpecialtyById);

// Protected routes (cần auth - admin only)
// router.use(authenticate);
// router.use(authorize(['admin']));

router.post('/', specialtyController.createSpecialty);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);
router.patch('/:id/priority', specialtyController.updatePriority);
router.patch('/:id/toggle-active', specialtyController.toggleActive);

module.exports = router;
