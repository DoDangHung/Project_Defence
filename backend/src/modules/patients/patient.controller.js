import { patientService } from './patient.service.js';

export const patientController = {
  getProfile: async (req, res) => {
    try {
      const patient = await patientService.getProfile(req.params.id);
      console.log('data from patient:', patient);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const patient = await patientService.updateProfile(
        req.params.id,
        req.body
      );
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  getAppointments: async (req, res) => {
    try {
      const patient = await patientService.getAppointments(req.params.id);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  getUpcomingAppointments: async (req, res) => {
    try {
      const data = await patientService.getUpcomingAppointments(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  getPastAppointments: async (req, res) => {
    try {
      const data = await patientService.getPastAppointments(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getPayments: async (req, res) => {
    try {
      const data = await patientService.getPayments(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {}
  },
};
