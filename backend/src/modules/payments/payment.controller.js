import { PaymentService } from './payment.service.js';
export const PaymentController = {
  // POST /api/payments - Tạo payment mới
  createPayment: async (req, res) => {
    try {
      const {
        appointmentId,
        patientId,
        consultationFee,
        depositPercentage,
        paymentMethod,
      } = req.body;

      // Validation
      if (!appointmentId || !patientId || !consultationFee) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required fields: appointmentId, patientId, consultationFee',
        });
      }

      if (consultationFee <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Consultation fee must be greater than 0',
        });
      }

      if (
        depositPercentage &&
        (depositPercentage < 0 || depositPercentage > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Deposit percentage must be between 0 and 100',
        });
      }

      const payment = await PaymentService.createPayment({
        appointmentId,
        patientId,
        consultationFee,
        depositPercentage,
        paymentMethod,
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

  // POST /api/payments/:id/deposit - Xử lý thanh toán đặt cọc
  processDeposit: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { paymentMethod, transactionId, provider } = req.body;

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required',
        });
      }

      const validMethods = ['cash', 'card', 'bank_transfer', 'insurance'];
      if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid payment method. Must be: cash, card, bank_transfer, or insurance',
        });
      }

      const payment = await PaymentService.processDeposit({
        paymentId,
        paymentMethod,
        transactionId,
        provider,
      });

      return res.status(200).json({
        success: true,
        message: 'Deposit processed successfully',
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

  // POST /api/payments/:id/final - Xử lý thanh toán cuối cùng
  processFinalPayment: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);
      const { paymentMethod, transactionId, provider, additionalCharges } =
        req.body;

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required',
        });
      }

      const validMethods = ['cash', 'card', 'bank_transfer', 'insurance'];
      if (!validMethods.includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method',
        });
      }

      const payment = await PaymentService.processFinalPayment({
        paymentId,
        paymentMethod,
        transactionId,
        provider,
        additionalCharges,
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

  // POST /api/payments/:id/charges - Thêm chi phí phát sinh
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

  // POST /api/payments/:id/refund - Hoàn tiền
  refundPayment: async (req, res) => {
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

      const payment = await paymentService.refundPayment({
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

  // GET /api/payments/:id - Lấy thông tin payment
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

  // GET /api/payments/appointment/:appointmentId - Lấy payment theo appointment
  getPaymentByAppointment: async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.appointmentId);

      const payment = await PaymentService.getPaymentByAppointment(
        appointmentId
      );

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

  // GET /api/payments/patient/:patientId - Lấy danh sách payment của bệnh nhân
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

  // GET /api/payments/:id/transactions - Lấy lịch sử giao dịch
  getTransactions: async (req, res) => {
    try {
      const paymentId = parseInt(req.params.id);

      const transactions = await PaymentService.getPaymentTransactions(
        paymentId
      );

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

  // GET /api/payments/stats - Thống kê doanh thu
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
};
