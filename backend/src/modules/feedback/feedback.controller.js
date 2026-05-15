import { feedbackService } from './feedback.service.js';

export const feedbackController = {
  // Tạo feedback
  createFeedback: async (req, res) => {
    try {
      const patientId = req.user.patientId;

      const { doctorId, appointmentId, rating, comment, professionalism, punctuality, communication, facilities } = req.body;

      if (!doctorId || !rating) {
        return res.status(400).json({
          success: false,
          message: 'doctorId và rating là bắt buộc',
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating phải từ 1-5',
        });
      }

      const feedback = await feedbackService.createFeedback({
        patientId,
        doctorId: parseInt(doctorId),
        appointmentId: appointmentId ? parseInt(appointmentId) : null,
        rating: parseInt(rating),
        comment,
        professionalism: professionalism ? parseInt(professionalism) : null,
        punctuality: punctuality ? parseInt(punctuality) : null,
        communication: communication ? parseInt(communication) : null,
        facilities: facilities ? parseInt(facilities) : null,
      });

      return res.status(201).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('Create feedback error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create feedback',
      });
    }
  },

  // Lấy feedback của bệnh nhân
  getPatientFeedbacks: async (req, res) => {
    try {
      const patientId = req.user.patientId;
      const feedbacks = await feedbackService.getPatientFeedbacks(patientId);

      return res.status(200).json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      console.error('Get patient feedbacks error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get feedbacks',
      });
    }
  },

  // Lấy feedback của bác sĩ
  getDoctorFeedbacks: async (req, res) => {
    try {
      const doctorId = req.user.doctorId;
      const feedbacks = await feedbackService.getDoctorFeedbacks(doctorId);

      return res.status(200).json({
        success: true,
        data: feedbacks,
      });
    } catch (error) {
      console.error('Get doctor feedbacks error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get feedbacks',
      });
    }
  },

  // Lấy thống kê feedback của bác sĩ
  getDoctorFeedbackStats: async (req, res) => {
    try {
      const doctorId = req.user.doctorId;
      const stats = await feedbackService.getDoctorFeedbackStats(doctorId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get doctor feedback stats error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get stats',
      });
    }
  },

  // Lấy tất cả feedback (admin)
  getAllFeedbacks: async (req, res) => {
    try {
      const { page, limit, doctorId, rating, search } = req.query;
      const result = await feedbackService.getAllFeedbacks({
        page: page || 1,
        limit: limit || 20,
        doctorId,
        rating,
        search,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Get all feedbacks error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get feedbacks',
      });
    }
  },

  // Bác sĩ reply feedback
  replyFeedback: async (req, res) => {
    try {
      const doctorId = req.user.doctorId;
      const { feedbackId } = req.params;
      const { reply } = req.body;

      if (!reply) {
        return res.status(400).json({
          success: false,
          message: 'Reply content is required',
        });
      }

      const feedback = await feedbackService.replyFeedback(parseInt(feedbackId), doctorId, reply);

      return res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('Reply feedback error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to reply',
      });
    }
  },

  // Ẩn/hiện feedback (admin)
  updateFeedbackStatus: async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const { status } = req.body;

      const feedback = await feedbackService.updateFeedbackStatus(parseInt(feedbackId), status);

      return res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      console.error('Update feedback status error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update',
      });
    }
  },
};
