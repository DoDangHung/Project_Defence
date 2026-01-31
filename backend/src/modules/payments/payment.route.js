// src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from './payment.controller.js';

const router = Router();

// ====================================
// PAYMENT MANAGEMENT ROUTES
// ====================================

/**
 * @route   POST /api/payments
 * @desc    Tạo payment mới khi đặt lịch khám
 * @access  Private
 * @body    { appointmentId, patientId, consultationFee, depositPercentage?, paymentMethod? }
 */
router.post('/', PaymentController.createPayment);

/**
 * @route   POST /api/payments/:id/deposit
 * @desc    Xử lý thanh toán đặt cọc
 * @access  Private
 * @body    { paymentMethod, transactionId?, provider? }
 */
router.post('/:id/deposit', PaymentController.processDeposit);

/**
 * @route   POST /api/payments/:id/final
 * @desc    Xử lý thanh toán cuối cùng (sau khi khám xong)
 * @access  Private
 * @body    { paymentMethod, transactionId?, provider?, additionalCharges? }
 */
router.post('/:id/final', PaymentController.processFinalPayment);

/**
 * @route   POST /api/payments/:id/charges
 * @desc    Thêm chi phí phát sinh (thuốc, xét nghiệm...)
 * @access  Private
 * @body    { service, amount }
 */
router.post('/:id/charges', PaymentController.addAdditionalCharge);

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Hoàn tiền
 * @access  Private (Admin/Staff only)
 * @body    { refundAmount, refundReason }
 */
router.post('/:id/refund', PaymentController.refundPayment);

/**
 * @route   GET /api/payments/:id
 * @desc    Lấy thông tin chi tiết payment
 * @access  Private
 */
router.get('/:id', PaymentController.getPayment);

/**
 * @route   GET /api/payments/appointment/:appointmentId
 * @desc    Lấy payment theo appointment ID
 * @access  Private
 */
router.get(
  '/appointment/:appointmentId',
  PaymentController.getPaymentByAppointment
);

/**
 * @route   GET /api/payments/patient/:patientId
 * @desc    Lấy tất cả payment của bệnh nhân
 * @access  Private
 */
router.get('/patient/:patientId', PaymentController.getPatientPayments);

/**
 * @route   GET /api/payments/:id/transactions
 * @desc    Lấy lịch sử giao dịch của payment
 * @access  Private
 */
router.get('/:id/transactions', PaymentController.getTransactions);

/**
 * @route   GET /api/payments/stats
 * @desc    Thống kê doanh thu
 * @access  Private (Admin only)
 * @query   startDate?, endDate?
 */
router.get('/stats', PaymentController.getStats);

export default router;
