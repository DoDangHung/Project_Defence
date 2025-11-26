import { appointmentService } from './appointment.service.js';
import prisma from '../../config/db.js';

export const AppointmentController = {
  getAvailableSlots: async (req, res) => {
    try {
      const { doctorId, date, duration } = req.query;

      const slots = await appointmentService.getAvailableSlots(
        doctorId,
        date,
        Number(duration) || 30
      );

      res.json({ success: true, slots });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getDoctorSlots: async (req, res) => {
    try {
      const { doctorId, date, duration } = req.query;
      const slots = await appointmentService.getDoctorBySlots(
        doctorId,
        date,
        Number(duration) || 30
      );
      res.json({ success: true, slots });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  //controller
  bookSlot: async (data) => {
    // ⭐ Nhận data thay vì destructure ngay
    const { patientId, doctorId, date, startTime, endTime, reason } = data;

    console.log('=== CONTROLLER RECEIVED ===');
    console.log({ patientId, doctorId, date, startTime, endTime, reason });

    // Validate
    if (!date || !startTime || !endTime) {
      throw new Error('Missing required fields: date, startTime, endTime');
    }

    if (!patientId || !doctorId) {
      throw new Error('Missing required fields: patientId, doctorId');
    }

    // Parse dates
    const dateObj = new Date(date);
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(dateObj.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }
    if (isNaN(start.getTime())) {
      throw new Error(`Invalid startTime format: ${startTime}`);
    }
    if (isNaN(end.getTime())) {
      throw new Error(`Invalid endTime format: ${endTime}`);
    }

    // Check conflict
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (conflict) {
      throw new Error('This time slot is already booked');
    }

    // Create appointment
    return prisma.appointment.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        date: dateObj,
        startTime: start,
        endTime: end,
        reason: reason || 'General checkup',
        status: 'pending',
      },
    });
  },

  cancelSlot: async (req, res) => {
    try {
      await appointmentService.cancelSlot(req.params.id);
      res.json({ success: true, message: 'Slot cancelled' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
