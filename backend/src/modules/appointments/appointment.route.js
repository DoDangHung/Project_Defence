import express from 'express';
import { AppointmentController } from '../appointments/appointment.controller.js';
const router = express.Router();
// Middleware để xác thực (bạn cần tự implement)
// const { authenticate, authorize } = require('../middleware/auth');

// Public routes hoặc routes cần authentication
router.get('/statistics', AppointmentController.getStatistics);
router.get('/patient/:patientId', AppointmentController.getPatientAppointments);
router.get('/doctor/:doctorId', AppointmentController.getDoctorAppointments);
router.get('/clinic/:clinicId', AppointmentController.getClinicAppointments);
router.get('/:id', AppointmentController.getAppointmentById);
router.get('/', AppointmentController.getAllAppointments);

router.post('/', AppointmentController.createAppointment);

router.put('/:id', AppointmentController.updateAppointment);
router.patch('/:id/status', AppointmentController.updateStatus);

router.delete('/:id', AppointmentController.deleteAppointment);

// 🆕 Các action mới
router.patch('/:id/confirm', AppointmentController.confirmAppointment);
router.patch('/:id/reschedule', AppointmentController.rescheduleAppointment);
router.patch('/:id/cancel', AppointmentController.cancelAppointment);
router.patch('/:id/status', AppointmentController.updateStatus);

router.delete('/:id', AppointmentController.deleteAppointment);

export default router;
