import express from 'express';
import { patientController } from './patient.controller.js';

const router = express.Router();

router.get('/:id', patientController.getProfile);

router.put('/:id', patientController.updateProfile);

// Patient Appointments
router.get('/:id/appointments', patientController.getAppointments);
router.get(
  '/:id/appointments/upcoming',
  patientController.getUpcomingAppointments
);
router.get('/:id/appointments/history', patientController.getPastAppointments);

// Patient Payments
router.get('/:id/payments', patientController.getPayments);

export default router;
