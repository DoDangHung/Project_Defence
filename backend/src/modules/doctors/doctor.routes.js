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
router.get('/:id', DoctorController.getDoctorById);
router.get('/by-department/:id', DoctorController.getDoctorsByDepartment);
router.post('/', DoctorController.createDoctor);
router.put('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deteleDoctor);

export default router;
