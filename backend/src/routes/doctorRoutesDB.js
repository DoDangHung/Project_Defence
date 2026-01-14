import express from 'express';
import { scheduleController } from '../modules/schedules/schedules.controller.js';
import {
  authenticateToken,
  checkDoctorRole,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

// Tất cả routes dưới này yêu cầu authentication + doctor role
router.use(authenticateToken);
router.use(checkDoctorRole);

// GET /api/doctor/schedules/my-schedules
router.get('/schedules/my-schedules', scheduleController.getByDoctor);

// POST /api/doctor/schedules
router.post('/schedules', scheduleController.create);

// PUT /api/doctor/schedules/:id
router.put('/schedules/:id', scheduleController.update);

// DELETE /api/doctor/schedules/:id
router.delete('/schedules/:id', scheduleController.delete);

export default router;
