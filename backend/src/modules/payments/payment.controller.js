import { PaymentService } from './payment.service.js';
import prisma from '../../config/db.js';

export const PaymentController = {
  // POST /api/payment - Tạo payment mới
  createPayment: async (req, res) => {
    try {
      const { appointmentId, patientId, consultationFee, paymentMethod } = req.body;

      if (!appointmentId || !patientId || !consultationFee) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: appointmentId, patientId, consultationFee',
        });
      }

      if (consultationFee <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Consultation fee must be greater than 0',
        });
      }

      const validMethods = ['cash', 'visa_mastercard', 'apple_google_pay', 'bank_transfer'];
      if (paymentMethod && !validMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method',
        });
      }

      const payment = await PaymentService.createPayment({
        appointmentId,
        patientId,
        consultationFee,
        paymentMethod: paymentMethod || 'cash',
      });

      return res.status(201).json({
        success: true,
        message: 'Payment created successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Create payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create payment',
      });
    }
  },

  // POST /api/payment/:id/deposit - Xử lý thanh toán đặt cọc (online payments)
  processDeposit: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { transactionId } = req.body;

      const payment = await PaymentService.processDeposit({
        paymentId,
        transactionId,
      });

      return res.status(200).json({
        success: true,
        message: 'Deposit payment successful',
        data: payment,
      });
    } catch (error) {
      console.error('Process deposit error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to process deposit',
      });
    }
  },

  // POST /api/payment/:id/final - Xử lý thanh toán cuối cùng
  processFinalPayment: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { transactionId, additionalCharges } = req.body;

      const payment = await PaymentService.processFinalPayment({
        paymentId,
        transactionId,
        additionalCharges: additionalCharges || [],
      });

      return res.status(200).json({
        success: true,
        message: 'Final payment processed successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Process final payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to process final payment',
      });
    }
  },

  // POST /api/payment/:id/cash - Xử lý thanh toán tiền mặt tại quầy
  processCashPayment: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { amountReceived } = req.body;

      const payment = await PaymentService.processCashPayment({
        paymentId,
        amountReceived,
      });

      return res.status(200).json({
        success: true,
        message: 'Cash payment processed successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Process cash payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to process cash payment',
      });
    }
  },

  // POST /api/payment/:id/cancel - Hủy lịch với refund
  cancelWithRefund: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { reason } = req.body;

      const result = await PaymentService.cancelAppointmentWithRefund(
        paymentId,
        reason || 'Patient cancelled'
      );

      return res.status(200).json({
        success: true,
        message: 'Appointment cancelled',
        data: result,
      });
    } catch (error) {
      console.error('Cancel with refund error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to cancel appointment',
      });
    }
  },

  // POST /api/payment/:id/charges - Thêm chi phí phát sinh
  addAdditionalCharge: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { service, amount } = req.body;

      if (!service || !amount) {
        return res.status(400).json({
          success: false,
          message: 'Service and amount are required',
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0',
        });
      }

      const payment = await PaymentService.addAdditionalCharge(paymentId, {
        service,
        amount,
      });

      return res.status(200).json({
        success: true,
        message: 'Additional charge added successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Add additional charge error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to add additional charge',
      });
    }
  },

  // POST /api/payment/:id/refund - Hoàn tiền thủ công (admin)
  manualRefund: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { refundAmount, refundReason } = req.body;

      if (!refundAmount || !refundReason) {
        return res.status(400).json({
          success: false,
          message: 'Refund amount and reason are required',
        });
      }

      if (refundAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Refund amount must be greater than 0',
        });
      }

      const payment = await PaymentService.manualRefund({
        paymentId,
        refundAmount,
        refundReason,
      });

      return res.status(200).json({
        success: true,
        message: 'Payment refunded successfully',
        data: payment,
      });
    } catch (error) {
      console.error('Refund payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to refund payment',
      });
    }
  },

  // GET /api/payment/:id - Lấy thông tin payment
  getPayment: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const payment = await PaymentService.getPaymentById(paymentId);

      return res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error('Get payment error:', error);
      return res.status(404).json({
        success: false,
        message: error.message || 'Payment not found',
      });
    }
  },

  // GET /api/payment/appointment/:appointmentId - Lấy payment theo appointment
  getPaymentByAppointment: async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);
      const payment = await PaymentService.getPaymentByAppointment(appointmentId);

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found for this appointment',
        });
      }

      return res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      console.error('Get payment by appointment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment',
      });
    }
  },

  // GET /api/payment/my-payments - Lấy payments của user hiện tại (patient)
  getMyPayments: async (req, res) => {
    try {
      // Ưu tiên patientId từ token, fallback sang userId
      const patientId = req.user?.patientId;
      const userId = req.user?.userId || req.user?.id;

      let actualPatientId = patientId;

      // Nếu không có patientId trong token, tìm qua userId
      if (!actualPatientId && userId) {
        const patient = await prisma.patient.findUnique({
          where: { userId },
        });
        actualPatientId = patient?.id;
      }

      if (!actualPatientId) {
        return res.status(404).json({
          success: false,
          message: 'Patient profile not found',
        });
      }

      const payments = await PaymentService.getMyPayments(actualPatientId);

      return res.status(200).json({
        success: true,
        data: payments,
        total: payments.length,
      });
    } catch (error) {
      console.error('Get my payments error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payments',
      });
    }
  },

  // GET /api/payment/patient/:patientId - Lấy danh sách payment của bệnh nhân
  getPatientPayments: async (req, res) => {
    try {
      const patientId = parseInt(req.params.patientId);
      const payments = await PaymentService.getPatientPayments(patientId);

      return res.status(200).json({
        success: true,
        data: payments,
        total: payments.length,
      });
    } catch (error) {
      console.error('Get patient payments error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get patient payments',
      });
    }
  },

  // GET /api/payment/:id/transactions - Lấy lịch sử giao dịch
  getTransactions: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const transactions = await PaymentService.getPaymentTransactions(paymentId);

      return res.status(200).json({
        success: true,
        data: transactions,
        total: transactions.length,
      });
    } catch (error) {
      console.error('Get transactions error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get transactions',
      });
    }
  },

  // GET /api/payment - Lấy danh sách tất cả payments (admin)
  getAllPayments: async (req, res) => {
    try {
      const { page, limit, status, paymentMethod, search, startDate, endDate } = req.query;

      const result = await PaymentService.getAllPayments({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 50,
        status,
        paymentMethod,
        search,
        startDate,
        endDate,
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error('Get all payments error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payments',
      });
    }
  },

  // GET /api/payment/stats - Thống kê doanh thu
  getStats: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;

      const stats = await PaymentService.getPaymentStats(start, end);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('Get stats error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get payment stats',
      });
    }
  },

  // GET /api/payment/policy - Lấy thông tin chính sách refund
  getRefundPolicy: async (req, res) => {
    try {
      const policy = await PaymentService.getRefundPolicy();

      return res.status(200).json({
        success: true,
        data: policy,
      });
    } catch (error) {
      console.error('Get refund policy error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get refund policy',
      });
    }
  },

  // POST /api/payment/:id/no-show - Đánh dấu không đến
  markNoShow: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { reason } = req.body;

      const result = await PaymentService.markAsNoShow(paymentId, reason);

      return res.status(200).json({
        success: true,
        message: result.forfeitInfo.message,
        data: result,
      });
    } catch (error) {
      console.error('Mark no-show error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark as no-show',
      });
    }
  },

  // POST /api/payment/:id/confirm-payment - Xác nhận thanh toán (admin)
  confirmPayment: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { additionalCharges, notes } = req.body;

      const payment = await PaymentService.processFinalPayment({
        paymentId,
        additionalCharges: additionalCharges || [],
        notes,
      });

      return res.status(200).json({
        success: true,
        message: 'Xác nhận thanh toán thành công',
        data: payment,
      });
    } catch (error) {
      console.error('Confirm payment error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to confirm payment',
      });
    }
  },
};
