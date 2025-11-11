import express from 'express';
import * as DoctorController from '../controllers/doctor.controller.js';

const router = express.Router();

router.get('/', DoctorController.getAllDoctor);
router.get('/:doctorId', DoctorController.getDoctorById);
router.post('/', DoctorController.createDoctor);
router.put('/:id', DoctorController.updateDoctor);
router.delete('/:id', DoctorController.deteleDoctor);
export default router;
