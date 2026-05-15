import express from 'express';
import { feedbackController } from './feedback.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Tạo feedback (patient)
router.post('/', authenticateToken, feedbackController.createFeedback);

// Lấy feedback của bệnh nhân
router.get('/patient', authenticateToken, feedbackController.getPatientFeedbacks);

// Lấy feedback của bác sĩ
router.get('/doctor', authenticateToken, feedbackController.getDoctorFeedbacks);

// Lấy thống kê feedback của bác sĩ
router.get('/doctor/stats', authenticateToken, feedbackController.getDoctorFeedbackStats);

// Lấy tất cả feedback (admin)
router.get('/', authenticateToken, feedbackController.getAllFeedbacks);

// Reply feedback (doctor)
router.put('/:feedbackId/reply', authenticateToken, feedbackController.replyFeedback);

// Ẩn/hiện feedback (admin)
router.put('/:feedbackId/status', authenticateToken, feedbackController.updateFeedbackStatus);

export default router;
