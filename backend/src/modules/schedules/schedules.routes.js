import express from 'express';
import { scheduleController } from './schedules.controller.js';
import * as DoctorController from '../doctors/doctor.controller.js';
import {
  authenticateToken,
  checkDoctorRole,
} from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/doctor/:doctorId', scheduleController.getByDoctor);

router.post('/', authenticateToken, checkDoctorRole, scheduleController.create);

router.put('/:id', scheduleController.update);

router.delete('/:id', scheduleController.delete);

// 1. Lấy danh sách bác sĩ theo phòng khám
router.get('/clinics/:clinicId/doctors', DoctorController.getDoctorsByClinic);

// 3. (Optional) Lấy cả bác sĩ kèm lịch trong clinic
router.get(
  '/clinics/:clinicId/doctors/schedules',
  scheduleController.getDoctorsAndSchedules
);

export default router;
