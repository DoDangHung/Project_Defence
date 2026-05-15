// Payment Service
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const paymentService = {
  // Tạo payment mới
  createPayment: async (data) => {
    try {
      const response = await apiClient.post('/payment', {
        appointmentId: data.appointmentId,
        patientId: data.patientId,
        consultationFee: data.consultationFee,
        paymentMethod: data.paymentMethod,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xử lý thanh toán đặt cọc (fake - auto success)
  processDeposit: async (paymentId, data = {}) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/deposit`, {
        transactionId: data.transactionId,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xử lý thanh toán cuối cùng
  processFinalPayment: async (paymentId, data = {}) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/final`, {
        transactionId: data.transactionId,
        additionalCharges: data.additionalCharges || [],
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Xử lý thanh toán tiền mặt tại quầy
  processCashPayment: async (paymentId, data = {}) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/cash`, {
        amountReceived: data.amountReceived,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hủy lịch với refund tự động
  cancelWithRefund: async (paymentId, reason = '') => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/cancel`, {
        reason,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thêm chi phí phát sinh
  addAdditionalCharge: async (paymentId, charge) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/charges`, {
        service: charge.service,
        amount: charge.amount,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Hoàn tiền thủ công (admin)
  manualRefund: async (paymentId, refundData) => {
    try {
      const response = await apiClient.post(`/payment/${paymentId}/refund`, {
        refundAmount: refundData.refundAmount,
        refundReason: refundData.refundReason,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy thông tin payment
  getPaymentById: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payment/${paymentId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy payment theo appointment
  getPaymentByAppointment: async (appointmentId) => {
    try {
      const response = await apiClient.get(`/payment/appointment/${appointmentId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy danh sách payment của bệnh nhân
  getPatientPayments: async (patientId) => {
    try {
      const response = await apiClient.get(`/payment/patient/${patientId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy lịch sử giao dịch
  getPaymentTransactions: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payment/${paymentId}/transactions`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy chính sách refund
  getRefundPolicy: async () => {
    try {
      const response = await apiClient.get('/payment/policy');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Thống kê doanh thu
  getStats: async (startDate, endDate) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const response = await apiClient.get('/payment/stats', { params, ...getAuthHeader() });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Appointment Service
export const appointmentService = {
  createAppointment: async (data) => {
    try {
      const response = await apiClient.post('/appointments', {
        patientId: data.patientId,
        doctorId: data.doctorId,
        clinicId: data.clinicId,
        scheduleId: data.scheduleId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        slotIndex: data.slotIndex,
        reason: data.reason,
      }, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await apiClient.get(`/appointments/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await apiClient.post(
        `/appointments/${appointmentId}/cancel`,
        { reason },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Lấy appointments của bệnh nhân
  getPatientAppointments: async (patientId) => {
    try {
      const response = await apiClient.get(`/appointments/patient/${patientId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default { paymentService, appointmentService };
