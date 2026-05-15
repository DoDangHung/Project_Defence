import prisma from '../../config/db.js';

// Deposit percentage for online payments
const DEPOSIT_PERCENTAGE = 25;

// Payment methods that require deposit
const METHODS_REQUIRING_DEPOSIT = ['visa_mastercard', 'apple_google_pay', 'bank_transfer'];

// Check if payment method requires deposit
const requiresDeposit = (method) => METHODS_REQUIRING_DEPOSIT.includes(method);

// Calculate refund percentage based on cancellation time
const calculateRefundPercentage = (appointmentTime) => {
  const now = new Date();
  const appointmentDate = new Date(appointmentTime);
  const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);

  if (hoursUntilAppointment > 24) {
    return 100; // Cancel >24h before: 100% refund
  } else if (hoursUntilAppointment > 12) {
    return 50; // Cancel >12h before: 50% refund
  } else if (hoursUntilAppointment > 2) {
    return 0; // Cancel >2h before: 0% refund, forfeit deposit
  } else {
    return -1; // <2h: appointment already passed or too close, forfeit
  }
};

export const PaymentService = {
  // Tạo payment mới khi book appointment
  createPayment: async (data) => {
    const {
      appointmentId,
      patientId,
      consultationFee,
      paymentMethod = 'cash',
    } = data;

    // Check if appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { appointmentId },
    });

    if (existingPayment) {
      throw new Error('Payment already exists for this appointment');
    }

    // Calculate amounts
    const needsDeposit = requiresDeposit(paymentMethod);
    const depositAmount = needsDeposit 
      ? (consultationFee * DEPOSIT_PERCENTAGE) / 100 
      : 0;
    const remainingAmount = consultationFee - depositAmount;

    // Calculate cancellation deadlines (only if appointment has valid date)
    let cancellationDeadline = null;
    let cancellationHalfwayDeadline = null;
    
    // Support both field names: appointmentDate (common) or date
    const aptDate = appointment.appointmentDate || appointment.date;
    if (aptDate) {
      const appointmentTime = new Date(aptDate);
      if (!isNaN(appointmentTime.getTime())) {
        cancellationDeadline = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
        cancellationHalfwayDeadline = new Date(appointmentTime.getTime() - 12 * 60 * 60 * 1000);
      }
    }

    // Determine payment status based on method
    let depositStatus = 'pending';
    let paymentStatus = 'pending';

    // Cash: No deposit, pay at clinic
    if (paymentMethod === 'cash') {
      depositStatus = 'not_required'; // Will pay full at clinic
      paymentStatus = 'pending';
    }

    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        patientId,
        consultationFee,
        depositAmount,
        remainingAmount,
        totalPaid: 0,
        depositStatus,
        paymentStatus,
        paymentMethod,
        paymentProvider: needsDeposit ? 'internal' : null, // Mark as needing payment
        ...(cancellationDeadline && { cancellationDeadline }),
        ...(cancellationHalfwayDeadline && { cancellationHalfwayDeadline }),
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    return payment;
  },

  // Xử lý thanh toán đặt cọc (fake payment)
  processDeposit: async (data) => {
    const {
      paymentId,
      transactionId,
    } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { appointment: true },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.depositStatus === 'paid') {
      throw new Error('Deposit already paid');
    }

    if (!requiresDeposit(payment.paymentMethod)) {
      throw new Error('This payment method does not require deposit');
    }

    // Generate fake transaction ID if not provided
    const fakeTransactionId = transactionId || `FAKE_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        depositStatus: 'paid',
        paymentStatus: 'partial',
        totalPaid: payment.depositAmount,
        depositTransactionId: fakeTransactionId,
        paymentProvider: payment.paymentMethod === 'visa_mastercard' ? 'stripe_fake' : 
                        payment.paymentMethod === 'apple_google_pay' ? 'stripe_fake' : 'payos_fake',
        depositPaidAt: new Date(),
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'deposit',
        amount: payment.depositAmount,
        status: 'completed',
        transactionId: fakeTransactionId,
        gatewayResponse: {
          status: 'success',
          message: 'Fake payment successful',
          processedAt: new Date().toISOString(),
        },
        note: `Đặt cọc ${DEPOSIT_PERCENTAGE}% cho lịch khám`,
      },
    });

    return updatedPayment;
  },

  // Xử lý thanh toán cuối cùng (sau khi khám xong)
  processFinalPayment: async (data) => {
    const {
      paymentId,
      transactionId,
      additionalCharges = [],
    } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.paymentStatus === 'completed') {
      throw new Error('Payment already completed');
    }

    // Generate fake transaction ID
    const fakeTransactionId = transactionId || `FAKE_FINAL_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate total additional charges
    const totalAdditionalCharges = additionalCharges.reduce(
      (sum, charge) => sum + (charge.amount || 0),
      0
    );
    const finalAmount = payment.remainingAmount + totalAdditionalCharges;

    // Prepare additional charges with status
    const chargesWithStatus = additionalCharges.map((charge) => ({
      ...charge,
      status: 'paid',
      paidAt: new Date().toISOString(),
    }));

    // Merge with existing charges
    const existingCharges = Array.isArray(payment.additionalCharges)
      ? payment.additionalCharges
      : [];
    const allCharges = [...existingCharges, ...chargesWithStatus];

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentStatus: 'completed',
        totalPaid: payment.totalPaid + finalAmount,
        finalTransactionId: fakeTransactionId,
        additionalCharges: allCharges,
        finalPaidAt: new Date(),
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'final',
        amount: finalAmount,
        status: 'completed',
        transactionId: fakeTransactionId,
        gatewayResponse: {
          status: 'success',
          message: 'Fake final payment successful',
          processedAt: new Date().toISOString(),
        },
        note: 'Thanh toán phần còn lại + chi phí phát sinh',
      },
    });

    return updatedPayment;
  },

  // Đánh dấu bệnh nhân không đến (No-show)
  markAsNoShow: async (paymentId, reason = 'Không đến khám') => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        appointment: true,
        patient: true,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.paymentStatus === 'completed' || payment.paymentStatus === 'refunded') {
      throw new Error('Cannot mark as no-show: payment already completed or refunded');
    }

    // Check if appointment time has passed
    const appointmentTime = new Date(payment.appointment?.appointmentDate || payment.appointment?.date);
    const now = new Date();

    if (now < appointmentTime) {
      throw new Error('Cannot mark as no-show: appointment time has not arrived yet');
    }

    // Calculate forfeit
    const hoursUntilAppointment = (now - appointmentTime) / (1000 * 60 * 60);

    let forfeitAmount = 0;
    let forfeitStatus = 'forfeited';

    // If already past 2h from appointment time, forfeit 100% of deposit
    if (hoursUntilAppointment >= 2) {
      forfeitAmount = payment.depositAmount;
      forfeitStatus = 'full_forfeit';
    } else {
      // Within 2h window - still can forfeit but log the time
      forfeitAmount = payment.depositAmount;
      forfeitStatus = 'forfeited';
    }

    // Update payment - forfeit deposit
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        depositStatus: 'forfeited',
        paymentStatus: 'forfeited',
        refundAmount: 0,
        refundPercentage: 0,
        refundReason: reason,
        forfeitedAt: new Date(),
        totalPaid: payment.totalPaid, // Keep deposit as revenue
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'forfeit',
        amount: forfeitAmount,
        status: 'completed',
        refundPercentage: 0,
        refundReason: reason,
        note: `Không đến khám. Forfeit ${forfeitAmount.toLocaleString('vi-VN')}đ vào doanh thu.`,
      },
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: payment.appointmentId },
      data: { status: 'no_show' },
    });

    return {
      payment: updatedPayment,
      forfeitInfo: {
        forfeitAmount,
        forfeitStatus,
        forfeitPercentage: 0,
        message: `Đã xử lý forfeit ${forfeitAmount.toLocaleString('vi-VN')}đ (100% deposit) vào doanh thu vì bệnh nhân không đến khám.`,
      },
    };
  },

  // Xử lý thanh toán tiền mặt tại quầy (khi đến khám)
  processCashPayment: async (data) => {
    const { paymentId, amountReceived } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.paymentStatus === 'completed') {
      throw new Error('Payment already completed');
    }

    if (payment.paymentMethod !== 'cash') {
      throw new Error('This is not a cash payment');
    }

    const fakeTransactionId = `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const finalAmount = payment.remainingAmount;

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        depositStatus: 'not_required',
        paymentStatus: 'completed',
        totalPaid: amountReceived || finalAmount,
        finalTransactionId: fakeTransactionId,
        paymentProvider: 'cash_counter',
        finalPaidAt: new Date(),
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'final',
        amount: finalAmount,
        status: 'completed',
        transactionId: fakeTransactionId,
        note: 'Thanh toán tiền mặt tại quầy',
      },
    });

    return updatedPayment;
  },

  // Hủy lịch và hoàn tiền (nếu có)
  cancelAppointmentWithRefund: async (paymentId, reason = 'Patient cancelled') => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { appointment: true },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Support both field names: appointmentDate or date
    const appointmentTime = payment.appointment?.appointmentDate || payment.appointment?.date;
    if (!appointmentTime) {
      throw new Error('Appointment date not found');
    }

    const refundPercentage = calculateRefundPercentage(appointmentTime);
    let refundAmount = 0;
    let refundStatus = 'not_applicable';
    let paymentStatus = payment.paymentStatus;
    let depositStatus = payment.depositStatus;

    // Determine refund based on timing and payment method
    if (requiresDeposit(payment.paymentMethod)) {
      if (refundPercentage === 100) {
        // Cancel >24h before: refund 100% of deposit
        refundAmount = payment.depositAmount;
        refundStatus = 'full_refund';
      } else if (refundPercentage === 50) {
        // Cancel >12h before: refund 50% of deposit
        refundAmount = payment.depositAmount * 0.5;
        refundStatus = 'partial_refund';
      } else if (refundPercentage === 0) {
        // Cancel 2-12h before: 0% refund, forfeit deposit
        refundAmount = 0;
        refundStatus = 'forfeit';
        depositStatus = 'forfeited';
        paymentStatus = 'forfeited';
      } else {
        // Cancel <2h: appointment passed or too close
        refundAmount = 0;
        refundStatus = 'forfeit';
        depositStatus = 'forfeited';
        paymentStatus = 'forfeited';
      }
    } else {
      // Cash payment - no deposit to refund
      refundAmount = 0;
      refundStatus = 'no_deposit';
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        refundAmount,
        refundPercentage,
        refundReason: reason,
        refundedAt: refundAmount > 0 ? new Date() : null,
        forfeitedAt: refundStatus === 'forfeit' ? new Date() : null,
        depositStatus,
        paymentStatus,
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: refundAmount > 0 ? 'refund' : 'forfeit',
        amount: refundAmount,
        status: refundAmount > 0 ? 'completed' : 'processed',
        refundPercentage,
        refundReason: reason,
        note: refundStatus === 'full_refund' ? 'Hoàn tiền 100% (hủy trước 24h)' :
              refundStatus === 'partial_refund' ? 'Hoàn tiền 50% (hủy trước 12h)' :
              refundStatus === 'forfeit' ? 'Mất tiền đặt cọc (hủy trong 12h)' :
              'Không có tiền đặt cọc',
      },
    });

    return {
      payment: updatedPayment,
      refundInfo: {
        refundPercentage,
        refundAmount,
        refundStatus,
        message: refundStatus === 'full_refund' ? 'Bạn sẽ được hoàn 100% tiền đặt cọc trong 3-5 ngày làm việc' :
                  refundStatus === 'partial_refund' ? 'Bạn sẽ được hoàn 50% tiền đặt cọc trong 3-5 ngày làm việc' :
                  refundStatus === 'forfeit' ? 'Tiền đặt cọc sẽ không được hoàn do hủy lịch trong vòng 12 giờ' :
                  'Lịch hẹn đã được hủy',
      },
    };
  },

  // Lấy thông tin payment
  getPaymentById: async (paymentId) => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            clinic: true,
          },
        },
        patient: { include: { user: true } },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Add cancellation info (support both field names)
    const aptTime = payment.appointment?.appointmentDate || payment.appointment?.date;
    if (aptTime) {
      const refundPercentage = calculateRefundPercentage(aptTime);
      payment.cancellationInfo = {
        refundPercentage,
        refundAmount: requiresDeposit(payment.paymentMethod) 
          ? payment.depositAmount * (refundPercentage / 100) 
          : 0,
        canCancel: refundPercentage >= 0,
        deadlineMessage: refundPercentage === 100 ? 'Có thể hủy và được hoàn 100%' :
                        refundPercentage === 50 ? 'Hủy sẽ được hoàn 50%' :
                        refundPercentage === 0 ? 'Hủy sẽ mất tiền đặt cọc' :
                        'Đã quá thời hạn hủy',
      };
    }

    return payment;
  },

  // Lấy payment theo appointment
  getPaymentByAppointment: async (appointmentId) => {
    const payment = await prisma.payment.findUnique({
      where: { appointmentId },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            clinic: true,
          },
        },
        patient: { include: { user: true } },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return payment;
  },

  // Lấy payments của user hiện tại (theo patientId)
  getMyPayments: async (patientId) => {
    console.log('DEBUG getMyPayments - patientId:', patientId);

    const payments = await prisma.payment.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            clinic: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('DEBUG getMyPayments - payments count:', payments.length);
    if (payments.length > 0) {
      console.log('DEBUG getMyPayments - sample payment:', {
        id: payments[0].id,
        appointmentId: payments[0].appointmentId,
        paymentStatus: payments[0].paymentStatus,
        depositStatus: payments[0].depositStatus,
        transactionsCount: payments[0].transactions?.length
      });
    }

    return payments;
  },

  // Lấy danh sách payment của bệnh nhân (theo patientId)
  getPatientPayments: async (patientId) => {
    const payments = await prisma.payment.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            doctor: { include: { user: true } },
            clinic: true,
          },
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return payments;
  },

  // Lấy lịch sử giao dịch
  getPaymentTransactions: async (paymentId) => {
    const transactions = await prisma.paymentTransaction.findMany({
      where: { paymentId },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions;
  },

  // Thêm chi phí phát sinh
  addAdditionalCharge: async (paymentId, charge) => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    const existingCharges = Array.isArray(payment.additionalCharges)
      ? payment.additionalCharges
      : [];

    const newCharge = {
      ...charge,
      status: 'pending',
      addedAt: new Date().toISOString(),
    };

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        additionalCharges: [...existingCharges, newCharge],
        remainingAmount: payment.remainingAmount + charge.amount,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'additional',
        amount: charge.amount,
        status: 'pending',
        note: `Chi phí phát sinh: ${charge.service}`,
      },
    });

    return updatedPayment;
  },

  // Hoàn tiền thủ công (admin)
  manualRefund: async (data) => {
    const { paymentId, refundAmount, refundReason } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (refundAmount > (payment.totalPaid - (payment.refundAmount || 0))) {
      throw new Error('Refund amount exceeds available amount');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        refundAmount: (payment.refundAmount || 0) + refundAmount,
        refundReason,
        refundedAt: new Date(),
        totalPaid: payment.totalPaid - refundAmount,
        paymentStatus: payment.totalPaid - refundAmount === 0 ? 'refunded' : payment.paymentStatus,
      },
    });

    // Log transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        type: 'refund',
        amount: refundAmount,
        status: 'completed',
        refundReason,
        note: 'Hoàn tiền thủ công bởi admin',
      },
    });

    return updatedPayment;
  },

  // Thống kê doanh thu
  getPaymentStats: async (startDate, endDate) => {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const payments = await prisma.payment.findMany({
      where,
      select: {
        totalPaid: true,
        paymentMethod: true,
        consultationFee: true,
        depositAmount: true,
        depositStatus: true,
        paymentStatus: true,
        refundAmount: true,
        additionalCharges: true,
      },
    });

    const stats = {
      // Tổng tiền đã thu (bao gồm cả forfeited deposit)
      totalRevenue: payments.reduce((sum, p) => sum + p.totalPaid, 0) + 
                    payments.filter(p => p.paymentStatus === 'forfeited').reduce((sum, p) => sum + (p.depositAmount || 0), 0),
      totalPayments: payments.length,
      pendingDeposits: payments.filter(p => p.depositStatus === 'pending').length,
      refundedAmount: payments.reduce((sum, p) => sum + (p.refundAmount || 0), 0),
      forfeitedAmount: payments.filter(p => p.paymentStatus === 'forfeited').reduce((sum, p) => sum + (p.depositAmount || 0), 0),
      noShowCount: payments.filter(p => p.paymentStatus === 'forfeited').length,
      // Tổng đặt cọc đã nhận
      totalDeposit: payments.reduce((sum, p) => sum + (p.depositStatus === 'paid' ? p.depositAmount : 0), 0),
      // Số tiền còn phải thu
      remainingToCollect: payments.reduce((sum, p) => sum + p.remainingAmount, 0),
      // Theo phương thức
      byMethod: {
        cash: payments.filter(p => p.paymentMethod === 'cash').length,
        visa_mastercard: payments.filter(p => p.paymentMethod === 'visa_mastercard').length,
        apple_google_pay: payments.filter(p => p.paymentMethod === 'apple_google_pay').length,
        bank_transfer: payments.filter(p => p.paymentMethod === 'bank_transfer').length,
      },
      // Chi tiết theo trạng thái
      byStatus: {
        pending: payments.filter(p => p.paymentStatus === 'pending').length,
        partial: payments.filter(p => p.paymentStatus === 'partial').length,
        completed: payments.filter(p => p.paymentStatus === 'completed').length,
        refunded: payments.filter(p => p.paymentStatus === 'refunded').length,
        forfeited: payments.filter(p => p.paymentStatus === 'forfeited').length,
      },
    };

    return stats;
  },

  // Get all payments for admin (with pagination and filters)
  getAllPayments: async (filters = {}) => {
    const {
      page = 1,
      limit = 50,
      status,
      paymentMethod,
      search,
      startDate,
      endDate,
    } = filters;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    const where = {};

    // Filter by status
    if (status && status !== 'all') {
      if (status === 'refunded' || status === 'forfeited') {
        where.paymentStatus = status;
      } else {
        where.paymentStatus = status;
      }
    }

    // Filter by payment method
    if (paymentMethod && paymentMethod !== 'all') {
      where.paymentMethod = paymentMethod;
    }

    // Search by patient name or appointment ID
    if (search) {
      where.OR = [
        { appointmentId: parseInt(search) || undefined },
        { patient: { user: { OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]}}},
      ].filter(Boolean);
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          patient: {
            include: { user: true },
          },
          appointment: {
            include: {
              doctor: { include: { user: true } },
              clinic: true,
            },
          },
          transactions: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  },

  // Get refund policy info
  getRefundPolicy: async () => {
    return {
      depositPercentage: DEPOSIT_PERCENTAGE,
      methodsRequiringDeposit: METHODS_REQUIRING_DEPOSIT,
      policies: [
        {
          scenario: 'Hủy trước 24 giờ',
          refundPercentage: 100,
          description: 'Được hoàn 100% tiền đặt cọc trong 3-5 ngày làm việc',
        },
        {
          scenario: 'Hủy trước 12 giờ',
          refundPercentage: 50,
          description: 'Được hoàn 50% tiền đặt cọc trong 3-5 ngày làm việc',
        },
        {
          scenario: 'Hủy trong vòng 2 giờ',
          refundPercentage: 0,
          description: 'Không được hoàn tiền đặt cọc',
        },
        {
          scenario: 'Thanh toán tiền mặt',
          refundPercentage: null,
          description: 'Không có tiền đặt cọc, thanh toán đầy đủ khi đến khám',
        },
      ],
    };
  },
};

export default PaymentService;



