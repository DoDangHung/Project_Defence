import express from 'express';
import clinicSpecialtyController from './clinicSpecialty.controller.js';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Lấy chuyên khoa của 1 phòng khám
router.get('/clinic/:clinicId', clinicSpecialtyController.getByClinic);

// Lấy phòng khám của 1 chuyên khoa
router.get('/specialty/:specialtyId', clinicSpecialtyController.getBySpecialty);

// Gán nhiều chuyên khoa cho phòng khám (thay thế tất cả)
router.post('/clinic/:clinicId/specialties', authenticateToken, authorizeRole('admin'), clinicSpecialtyController.assign);

// Thêm 1 chuyên khoa cho phòng khám
router.post('/', authenticateToken, authorizeRole('admin'), clinicSpecialtyController.add);

// Xóa 1 chuyên khoa khỏi phòng khám
router.delete('/:clinicId/:specialtyId', authenticateToken, authorizeRole('admin'), clinicSpecialtyController.remove);

export default router;
