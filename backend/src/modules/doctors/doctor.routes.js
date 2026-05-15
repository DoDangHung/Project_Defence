import express from 'express';
import * as DoctorController from '../doctors/doctor.controller.js';
import {
  authenticateToken,
  authorizeRole,
} from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', DoctorController.filterDoctorsCtrl);
router.get('/search', DoctorController.filterDoctorsCtrl);
router.get(
  '/patients/dashboard',
  authenticateToken,
  authorizeRole('Doctor'),
  DoctorController.getDoctorPatientsDashboard,
);
router.get('/searchDoctor', DoctorController.searchDoctors);

// Public: Lấy profile công khai của bác sĩ
router.get('/profile/:id', DoctorController.getDoctorPublicProfileCtrl);

// Doctor Panel: Cập nhật profile cá nhân
router.put(
  '/my-profile',
  authenticateToken,
  authorizeRole('Doctor'),
  DoctorController.updateMyProfileCtrl,
);
router.get(
  '/my-profile',
  authenticateToken,
  authorizeRole('Doctor'),
  DoctorController.getMyProfileCtrl,
);

// Admin: Duyệt profile bác sĩ
router.get(
  '/pending-profiles',
  authenticateToken,
  authorizeRole('Admin'),
  DoctorController.getPendingProfilesCtrl,
);
router.put(
  '/approve-profile/:doctorId',
  authenticateToken,
  authorizeRole('Admin'),
  DoctorController.approveProfileCtrl,
);

router.get('/:id', DoctorController.getDoctorById);
router.get('/by-department/:id', DoctorController.getDoctorsByDepartment);
router.post('/', DoctorController.createDoctor);
router.put('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deteleDoctor);

export default router;
