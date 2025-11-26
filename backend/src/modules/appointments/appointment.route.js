import express from 'express';
import { AppointmentController } from './appointment.controller.js';
import { appointmentService } from './appointment.service.js';

const router = express.Router();

// POST: Book appointment
router.post('/book', async (req, res) => {
  try {
    console.log('=== REQUEST BODY ===');
    console.log(req.body);

    const result = await AppointmentController.bookSlot(req.body);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: result,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// GET: Available slots
router.get('/available-slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const { duration } = req.query; // ?duration=30

    const slots = await appointmentService.getAvailableSlots(
      doctorId,
      date,
      duration ? Number(duration) : 30
    );

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// GET: Doctor slots with booking info
router.get('/doctor-slots/:doctorId/:date', async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const { duration } = req.query;

    const slots = await appointmentService.getDoctorBySlots(
      doctorId,
      date,
      duration ? Number(duration) : 30
    );

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
export default router;
