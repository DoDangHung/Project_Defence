import { availabilityService } from './availability.service.js';

export const availabilityController = {
  create: async (req, res) => {
    try {
      const data = await availabilityService.create(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getByDoctor: async (req, res) => {
    try {
      const data = await availabilityService.getByDoctor(req.params.doctorId);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await availabilityService.delete(req.params.id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};
