// src/services/paymentervice.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Payment Service
export const paymentService = {
  /**
   * Tạo payment mới
   */
  createPayment: async (data) => {
    try {
      const response = await apiClient.post('/payment', {
        appointmentId: data.appointmentId,
        patientId: data.patientId,
        consultationFee: data.consultationFee,
        depositPercentage: data.depositPercentage || 30,
        paymentMethod: data.paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xử lý thanh toán đặt cọc - TIỀN MẶT
   */
  processDepositCash: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/deposit`, {
        paymentMethod: 'cash',
        transactionId: `CASH-${Date.now()}`,
        provider: 'manual',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xử lý thanh toán đặt cọc - THẺ TÍN DỤNG
   */
  processDepositCard: async (paymentId, cardData) => {
    try {
      // Step 1: Gọi Stripe để tạo payment intent (nếu cần)
      // const stripeResponse = await stripeService.createPaymentIntent({...});

      // Step 2: Xác nhận thanh toán với backend
      const response = await apiClient.post(`/payment/${paymentId}/deposit`, {
        paymentMethod: 'card',
        transactionId: `STRIPE-${Date.now()}`, // Thay bằng Stripe transaction ID thực
        provider: 'stripe',
        metadata: {
          cardLast4: cardData.cardNumber.slice(-4),
          cardBrand: 'visa', // Detect từ card number
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xử lý thanh toán đặt cọc - CHUYỂN KHOẢN NGÂN HÀNG
   */
  processDepositBankTransfer: async (paymentId, bankData) => {
    try {
      // Step 1: Tạo order với PayOS
      // const payosResponse = await payosService.createOrder({...});

      // Step 2: Xác nhận với backend
      const response = await apiClient.post(`/payment/${paymentId}/deposit`, {
        paymentMethod: 'bank_transfer',
        transactionId: `PAYOS-${Date.now()}`, // Thay bằng PayOS order ID thực
        provider: 'payos',
        metadata: {
          bankCode: bankData.selectedBank,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xử lý thanh toán đặt cọc - BẢO HIỂM Y TẾ
   * Note: Insurance tự động thanh toán deposit
   */
  processDepositInsurance: async (paymentId, insuranceData) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/deposit`, {
        paymentMethod: 'insurance',
        transactionId: `INS-${Date.now()}`,
        provider: 'insurance',
        metadata: {
          insuranceNumber: insuranceData.insuranceNumber,
          insuranceType: insuranceData.insuranceType,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xử lý thanh toán cuối cùng (sau khi khám)
   */
  processFinalPayment: async (paymentId, data) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/final`, {
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        provider: data.provider || 'manual',
        additionalCharges: data.additionalCharges || [],
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Thêm chi phí phát sinh
   */
  addAdditionalCharge: async (paymentId, charge) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/charges`, {
        service: charge.service,
        amount: charge.amount,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Hoàn tiền
   */
  refundPayment: async (paymentId, refundData) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/refund`, {
        refundAmount: refundData.refundAmount,
        refundReason: refundData.refundReason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy thông tin payment
   */
  getPaymentById: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy payment theo appointment
   */
  getPaymentByAppointment: async (appointmentId) => {
    try {
      const response = await apiClient.get(
        `/payment/appointment/${appointmentId}`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy danh sách payment của bệnh nhân
   */
  getPatientpayment: async (patientId) => {
    try {
      const response = await apiClient.get(`/payment/patient/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy lịch sử giao dịch
   */
  getPaymentTransactions: async (paymentId) => {
    try {
      const response = await apiClient.get(
        `/payment/${paymentId}/transactions`,
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Thống kê doanh thu
   */
  getpaymenttats: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await apiClient.get('/payment/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Appointment Service (giả sử bạn cần)
export const appointmentService = {
  /**
   * Tạo appointment mới
   */
  createAppointment: async (data) => {
    try {
      const response = await apiClient.post('/appointments', {
        patientId: data.patientId,
        doctorId: data.doctorId,
        firstName: data.doctorFirstName,
        lastName: data.doctorLastName,
        clinicName: data.clinicName,
        clinicId: data.clinicId, // ✅ Thêm
        specialtyId: data.specialtyId,
        scheduleId: data.scheduleId, // ✅ Thêm
        date: data.date,
        startTime: data.startTime, // ✅ Thêm
        endTime: data.endTime, // ✅ Thêm
        slotIndex: data.slotIndex, // ✅ Thêm
        reason: data.reason,
        notes: data.notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Lấy thông tin appointment
   */
  getAppointmentById: async (id) => {
    try {
      const response = await apiClient.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Hủy appointment
   */
  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await apiClient.post(
        `/appointments/${appointmentId}/cancel`,
        {
          reason,
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default { paymentService, appointmentService };
