import { schedulesService } from './schedules.service.js';

export const scheduleController = {
  create: async (req, res) => {
    console.log('Body:', req.body);
    try {
      const result = await schedulesService.createSchedules(req.body);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

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

  getByDoctor: async (req, res) => {
    try {
      const data = await schedulesService.getSchedulesByDoctor(
        req.params.doctorId
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await schedulesService.deleteSchedules(req.params.id);
      res.status(200).json({ success: true, message: 'Schedule deleted' });
    } catch (error) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
