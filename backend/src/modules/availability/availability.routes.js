import express from 'express';
import { availabilityController } from './availability.controller.js';

const router = express.Router();

router.get('/doctor/:doctorId', availabilityController.getByDoctor);

router.post('/', availabilityController.create);

router.delete('/:id', availabilityController.delete);

export default router;
