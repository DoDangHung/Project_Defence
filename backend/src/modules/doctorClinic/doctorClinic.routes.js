import express from 'express';
import { doctorClinicController } from './doctorClinic.controller.js';
import { authenticateToken, authorizeRole } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Admin routes - manage doctor-clinic assignments
router.post(
  '/assign',
  authorizeRole('Admin'),
  doctorClinicController.assignDoctorToClinic
);

router.get(
  '/assignments',
  authorizeRole('Admin'),
  doctorClinicController.getAllAssignments
);

router.get(
  '/clinic/:clinicId',
  authorizeRole('Admin'),
  doctorClinicController.getClinicDoctorAssignments
);

router.put(
  '/assignments/:id',
  authorizeRole('Admin'),
  doctorClinicController.updateAssignment
);

router.delete(
  '/assignments/:id',
  authorizeRole('Admin'),
  doctorClinicController.removeAssignment
);

// Doctor routes - get own assignments
router.get(
  '/assignments/:doctorId',
  doctorClinicController.getDoctorAssignments
);

export default router;
