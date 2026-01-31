import { appointmentService } from '../appointments/appointment.service.js';

export const AppointmentController = {
  // GET /api/appointments
  getAllAppointments: async (req, res) => {
    try {
      const filters = req.query;
      const result = await appointmentService.getAllAppointments(filters);

      res.status(200).json({
        success: true,
        message: 'Appointments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving appointments',
        error: error.message,
      });
    }
  },

  // GET /api/appointments/:id
  getAppointmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      res.status(200).json({
        success: true,
        message: 'Appointment retrieved successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },

  // POST /api/appointments
  createAppointment: async (req, res) => {
    try {
      const appointment = await appointmentService.createAppointment(req.body);

      res.status(201).json({
        success: true,
        message: 'Appointment created successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating appointment',
        error: error.message,
      });
    }
  },

  // PUT /api/appointments/:id
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.updateAppointment(
        id,
        req.body,
      );

      res.status(200).json({
        success: true,
        message: 'Appointment updated successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating appointment',
        error: error.message,
      });
    }
  },

  // DELETE /api/appointments/:id
  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      await appointmentService.deleteAppointment(id);

      res.status(200).json({
        success: true,
        message: 'Appointment deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error deleting appointment',
        error: error.message,
      });
    }
  },

  // PATCH /api/appointments/:id/status
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
        });
      }

      const appointment = await appointmentService.updateStatus(id, status);

      res.status(200).json({
        success: true,
        message: 'Appointment status updated successfully',
        data: appointment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating appointment status',
        error: error.message,
      });
    }
  },

  // GET /api/appointments/patient/:patientId
  getPatientAppointments: async (req, res) => {
    try {
      const { patientId } = req.params;
      const filters = req.query;
      const result = await appointmentService.getPatientAppointments(
        patientId,
        filters,
      );

      res.status(200).json({
        success: true,
        message: 'Patient appointments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving patient appointments',
        error: error.message,
      });
    }
  },

  // GET /api/appointments/doctor/:doctorId
  getDoctorAppointments: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const filters = req.query;
      const result = await appointmentService.getDoctorAppointments(
        doctorId,
        filters,
      );

      res.status(200).json({
        success: true,
        message: 'Doctor appointments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving doctor appointments',
        error: error.message,
      });
    }
  },

  // GET /api/appointments/clinic/:clinicId
  getClinicAppointments: async (req, res) => {
    try {
      const { clinicId } = req.params;
      const filters = req.query;
      const result = await appointmentService.getClinicAppointments(
        clinicId,
        filters,
      );

      res.status(200).json({
        success: true,
        message: 'Clinic appointments retrieved successfully',
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving clinic appointments',
        error: error.message,
      });
    }
  },

  // GET /api/appointments/statistics
  getStatistics: async (req, res) => {
    try {
      const filters = req.query;
      const statistics = await appointmentService.getStatistics(filters);

      res.status(200).json({
        success: true,
        message: 'Appointment statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving appointment statistics',
        error: error.message,
      });
    }
  },

  // PATCH /api/appointments/:id/confirm
  confirmAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const { doctorId } = req.body; // Optional: để verify quyền

      const appointment = await appointmentService.confirmAppointment(
        id,
        doctorId,
      );

      res.status(200).json({
        success: true,
        message: 'Appointment confirmed successfully',
        data: appointment,
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: 'Error confirming appointment',
        error: error.message,
      });
    }
  },

  // PATCH /api/appointments/:id/reschedule
  rescheduleAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const rescheduleData = req.body;

      if (!rescheduleData.startTime || !rescheduleData.endTime) {
        return res.status(400).json({
          success: false,
          message: 'Start time and end time are required',
        });
      }

      const appointment = await appointmentService.rescheduleAppointment(
        id,
        rescheduleData,
      );

      res.status(200).json({
        success: true,
        message: 'Appointment rescheduled successfully',
        data: appointment,
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: 'Error rescheduling appointment',
        error: error.message,
      });
    }
  },

  // PATCH /api/appointments/:id/cancel
  cancelAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const { cancelReason, cancelledBy } = req.body;

      const appointment = await appointmentService.cancelAppointment(id, {
        cancelReason,
        cancelledBy,
      });

      res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully',
        data: appointment,
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: 'Error cancelling appointment',
        error: error.message,
      });
    }
  },
};
