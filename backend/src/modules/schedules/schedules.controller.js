import { schedulesService } from './schedules.service.js';
import prisma from '../../config/db.js';
// schedules.controller.js

export const scheduleController = {
  create: async (req, res) => {
    try {
      console.log('===== DEBUG CREATE SCHEDULE =====');
      console.log('req.user:', req.user);
      console.log('req.user.doctorId:', req.user?.doctorId);
      console.log('=================================');
      const doctorId = req.user?.doctorId;
      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: 'Missing doctorId',
          debug: req.user, // ← Xem req.user có gì
        });
      }

      const { date, startTime, endTime, slotDuration = 60 } = req.body;

      if (!date || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
        });
      }

      // Parse dates
      const parsedDate = new Date(date);
      const parsedStart = new Date(startTime);
      const parsedEnd = new Date(endTime);

      if (isNaN(parsedDate) || isNaN(parsedStart) || isNaN(parsedEnd)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format',
        });
      }

      // Validate: endTime phải sau startTime
      if (parsedEnd <= parsedStart) {
        return res.status(400).json({
          success: false,
          message: 'End time must be after start time',
        });
      }

      // Tạo schedule với slots
      const schedule = await schedulesService.createSchedules({
        doctorId,
        date: parsedDate,
        startTime: parsedStart,
        endTime: parsedEnd,
        slotDuration: parseInt(slotDuration),
      });

      // Generate slots để show
      const slots = schedulesService.generateTimeSlots(
        parsedStart,
        parsedEnd,
        parseInt(slotDuration)
      );

      return res.json({
        success: true,
        message: 'Schedule created successfully',
        data: {
          ...schedule,
          slots: slots.map((slot, index) => ({
            index,
            start: slot.start,
            end: slot.end,
            isBooked: false,
          })),
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message || 'Server error',
      });
    }
  },

  // getByDoctor giữ nguyên (đã có logic slots trong service)
  getByDoctor: async (req, res) => {
    try {
      const doctorId = Number(req.params.doctorId);
      if (!doctorId) {
        return res.status(400).json({
          success: false,
          message: 'Doctor ID is required',
        });
      }

      const data = await schedulesService.getSchedulesByDoctor(doctorId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // Các methods khác giữ nguyên...
  update: async (req, res) => {
    try {
      const data = await schedulesService.updateSchedules(
        req.params.id,
        req.body
      );
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await schedulesService.deleteSchedules(req.params.id);
      res.status(200).json({ success: true, message: 'Schedule deleted' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getDoctorsAndSchedules: async (req, res) => {
    try {
      const clinicId = Number(req.params.clinicId);
      const doctors = await schedulesService.getDoctorsAndSchedules(clinicId);
      res.status(200).json({ success: true, data: doctors });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch doctors & schedules',
      });
    }
  },
};
