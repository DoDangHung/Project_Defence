import express from 'express';
import { scheduleController } from './schedules.controller.js';

const router = express.Router();

router.get('/doctor/:doctorId', scheduleController.getByDoctor);

router.post('/', scheduleController.create);

router.put('/:id', scheduleController.update);

router.delete('/:id', scheduleController.delete);

export default router;
