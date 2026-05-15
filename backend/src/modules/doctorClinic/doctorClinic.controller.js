import { doctorClinicService } from './doctorClinic.service.js';

export const doctorClinicController = {
  // POST /api/doctor-clinic/assign
  assignDoctorToClinic: async (req, res) => {
    try {
      const result = await doctorClinicService.assignDoctorToClinic(req.body);

      res.status(201).json({
        success: true,
        message: 'Doctor assigned to clinic successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/doctor-clinic/assignments/:doctorId
  getDoctorAssignments: async (req, res) => {
    try {
      const { doctorId } = req.params;
      console.log('getDoctorAssignments called with doctorId:', doctorId, typeof doctorId);
      const assignments = await doctorClinicService.getDoctorAssignments(doctorId);

      res.status(200).json({
        success: true,
        message: 'Doctor assignments retrieved successfully',
        data: assignments,
      });
    } catch (error) {
      console.error('Error in getDoctorAssignments:', error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/doctor-clinic/clinic/:clinicId
  getClinicDoctorAssignments: async (req, res) => {
    try {
      const { clinicId } = req.params;
      const assignments = await doctorClinicService.getClinicDoctorAssignments(clinicId);

      res.status(200).json({
        success: true,
        message: 'Clinic doctor assignments retrieved successfully',
        data: assignments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET /api/doctor-clinic/assignments
  getAllAssignments: async (req, res) => {
    try {
      const result = await doctorClinicService.getAllAssignments(req.query);

      res.status(200).json({
        success: true,
        message: 'All assignments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // PUT /api/doctor-clinic/assignments/:id
  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await doctorClinicService.updateAssignment(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Assignment updated successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // DELETE /api/doctor-clinic/assignments/:id
  removeAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      await doctorClinicService.removeAssignment(id);

      res.status(200).json({
        success: true,
        message: 'Assignment removed successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
