// src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from './payment.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// ====================================
// PAYMENT MANAGEMENT ROUTES
// ====================================

/**
 * @route   POST /api/payment
 * @desc    Tạo payment mới khi đặt lịch khám
 * @access  Private
 * @body    { appointmentId, patientId, consultationFee, paymentMethod? }
 */
router.post('/', PaymentController.createPayment);

/**
 * @route   POST /api/payment/:id/deposit
 * @desc    Xử lý thanh toán đặt cọc (cho Visa, Apple Pay, Bank Transfer)
 * @access  Private
 * @body    { transactionId? }
 */
router.post('/:id/deposit', PaymentController.processDeposit);

/**
 * @route   POST /api/payment/:id/final
 * @desc    Xử lý thanh toán cuối cùng (sau khi khám xong)
 * @access  Private
 * @body    { transactionId?, additionalCharges? }
 */
router.post('/:id/final', PaymentController.processFinalPayment);

/**
 * @route   POST /api/payment/:id/cash
 * @desc    Xử lý thanh toán tiền mặt tại quầy
 * @access  Private
 * @body    { amountReceived? }
 */
router.post('/:id/cash', PaymentController.processCashPayment);

/**
 * @route   POST /api/payment/:id/cancel
 * @desc    Hủy lịch với tính toán refund tự động
 * @access  Private
 * @body    { reason? }
 */
router.post('/:id/cancel', PaymentController.cancelWithRefund);

/**
 * @route   POST /api/payment/:id/charges
 * @desc    Thêm chi phí phát sinh (thuốc, xét nghiệm...)
 * @access  Private
 * @body    { service, amount }
 */
router.post('/:id/charges', PaymentController.addAdditionalCharge);

/**
 * @route   POST /api/payment/:id/refund
 * @desc    Hoàn tiền thủ công (admin)
 * @access  Private (Admin only)
 * @body    { refundAmount, refundReason }
 */
router.post('/:id/refund', PaymentController.manualRefund);

/**
 * @route   GET /api/payment
 * @desc    Lấy danh sách tất cả payments (admin)
 * @access  Private (Admin only)
 * @query   page?, limit?, status?, paymentMethod?, search?, startDate?, endDate?
 */
router.get('/', PaymentController.getAllPayments);

/**
 * @route   GET /api/payment/my-payments
 * @desc    Lấy payments của user hiện tại (patient)
 * @access  Private
 */
router.get('/my-payments', authenticateToken, PaymentController.getMyPayments);

/**
 * @route   GET /api/payment/policy
 * @desc    Lấy thông tin chính sách refund
 * @access  Public
 */
router.get('/policy', PaymentController.getRefundPolicy);

/**
 * @route   GET /api/payment/stats
 * @desc    Thống kê doanh thu
 * @access  Private (Admin only)
 * @query   startDate?, endDate?
 */
router.get('/stats', PaymentController.getStats);

/**
 * @route   GET /api/payment/:id
 * @desc    Lấy thông tin chi tiết payment
 * @access  Private
 */
router.get('/:id', PaymentController.getPayment);

/**
 * @route   GET /api/payment/appointment/:appointmentId
 * @desc    Lấy payment theo appointment ID
 * @access  Private
 */
router.get('/appointment/:appointmentId', PaymentController.getPaymentByAppointment);

/**
 * @route   GET /api/payment/patient/:patientId
 * @desc    Lấy tất cả payment của bệnh nhân
 * @access  Private
 */
router.get('/patient/:patientId', PaymentController.getPatientPayments);

/**
 * @route   GET /api/payment/:id/transactions
 * @desc    Lấy lịch sử giao dịch của payment
 * @access  Private
 */
router.get('/:id/transactions', PaymentController.getTransactions);

/**
 * @route   POST /api/payment/:id/no-show
 * @desc    Đánh dấu bệnh nhân không đến (No-show)
 * @access  Private (Admin only)
 * @body    { reason? }
 */
router.post('/:id/no-show', PaymentController.markNoShow);

/**
 * @route   POST /api/payment/:id/confirm-payment
 * @desc    Xác nhận thanh toán phần còn lại (admin)
 * @access  Private (Admin only)
 * @body    { additionalCharges?, notes? }
 */
router.post('/:id/confirm-payment', PaymentController.confirmPayment);

export default router;
