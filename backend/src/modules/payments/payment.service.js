import prisma from '../../config/db.js';

export const PaymentService = {
  // Tạo payment mới khi book appointment
  createPayment: async (data) => {
    const {
      appointmentId,
      patientId,
      consultationFee,
      depositPercentage = 30,
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
    const depositAmount = (consultationFee * depositPercentage) / 100;
    const remainingAmount = consultationFee - depositAmount;

    // Determine payment status based on method
    let depositStatus = 'pending';
    let paymentStatus = 'pending';

    // Free booking for insurance (no deposit required)
    if (paymentMethod === 'insurance') {
      depositStatus = 'paid';
      paymentStatus = 'partial';
    }

    const payment = await prisma.payment.create({
      data: {
        appointmentId,
        patientId,
        consultationFee,
        depositAmount,
        remainingAmount,
        totalPaid: paymentMethod === 'insurance' ? depositAmount : 0,
        depositStatus,
        paymentStatus,
        paymentMethod,
        depositPaidAt: paymentMethod === 'insurance' ? new Date() : null,
      },
      include: {
        appointment: true,
        patient: true,
      },
    });

    // Log transaction if insurance
    if (paymentMethod === 'insurance') {
      await prisma.paymentTransaction.create({
        data: {
          paymentId: payment.id,
          transactionType: 'deposit',
          amount: depositAmount,
          status: 'success',
          provider: 'insurance',
          metadata: { note: 'Auto-paid by insurance' },
        },
      });
    }

    return payment;
  },

  // Xử lý thanh toán đặt cọc
  processDeposit: async (data) => {
    const {
      paymentId,
      paymentMethod,
      transactionId,
      provider = 'manual',
    } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.depositStatus === 'paid') {
      throw new Error('Deposit already paid');
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        depositStatus: 'paid',
        paymentStatus: 'partial',
        totalPaid: payment.depositAmount,
        depositTransactionId: transactionId,
        paymentMethod,
        paymentProvider: provider,
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
        transactionType: 'deposit',
        amount: payment.depositAmount,
        status: 'success',
        provider,
        transactionId,
        metadata: { paymentMethod },
      },
    });

    return updatedPayment;
  },

  // Xử lý thanh toán cuối cùng (sau khi khám xong)
  processFinalPayment: async (data) => {
    const {
      paymentId,
      paymentMethod,
      transactionId,
      provider = 'manual',
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

    // Calculate total additional charges
    const totalAdditionalCharges = additionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0
    );
    const finalAmount = payment.remainingAmount + totalAdditionalCharges;
    const newTotalPaid = payment.totalPaid + finalAmount;

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
        totalPaid: newTotalPaid,
        finalTransactionId: transactionId,
        paymentMethod,
        paymentProvider: provider,
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
        transactionType: 'final_payment',
        amount: finalAmount,
        status: 'success',
        provider,
        transactionId,
        metadata: {
          paymentMethod,
          additionalCharges: chargesWithStatus,
        },
      },
    });

    return updatedPayment;
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

    return updatedPayment;
  },

  // Hoàn tiền
  refundPayment: async (data) => {
    const { paymentId, refundAmount, refundReason } = data;

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (refundAmount > payment.totalPaid) {
      throw new Error('Refund amount exceeds total paid');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        refundAmount: (payment.refundAmount || 0) + refundAmount,
        refundReason,
        refundedAt: new Date(),
        totalPaid: payment.totalPaid - refundAmount,
        paymentStatus:
          payment.totalPaid - refundAmount === 0
            ? 'refunded'
            : payment.paymentStatus,
      },
    });

    // Log refund transaction
    await prisma.paymentTransaction.create({
      data: {
        paymentId,
        transactionType: 'refund',
        amount: refundAmount,
        status: 'success',
        provider: payment.paymentProvider || 'manual',
        metadata: { refundReason },
      },
    });

    return updatedPayment;
  },

  // Lấy thông tin payment
  getPaymentById: async (paymentId) => {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        appointment: {
          include: {
            doctor: true,
          },
        },
        patient: true,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  },

  // Lấy payment theo appointment
  getPaymentByAppointment: async (appointmentId) => {
    const payment = await prisma.payment.findUnique({
      where: { appointmentId },
      include: {
        appointment: true,
        patient: true,
      },
    });

    return payment;
  },

  // Lấy danh sách payment của bệnh nhân
  getPatientPayments: async (patientId) => {
    const payments = await prisma.payment.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: {
            doctor: true,
          },
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

  // Thống kê doanh thu
  getPaymentStats: async (startDate, endDate) => {
    const where = {
      paymentStatus: 'completed',
    };

    if (startDate || endDate) {
      where.finalPaidAt = {};
      if (startDate) where.finalPaidAt.gte = startDate;
      if (endDate) where.finalPaidAt.lte = endDate;
    }

    const payments = await prisma.payment.findMany({
      where,
      select: {
        totalPaid: true,
        paymentMethod: true,
        consultationFee: true,
        additionalCharges: true,
      },
    });

    const stats = {
      totalRevenue: payments.reduce((sum, p) => sum + p.totalPaid, 0),
      totalPayments: payments.length,
      byMethod: {
        cash: 0,
        card: 0,
        bank_transfer: 0,
        insurance: 0,
      },
      consultationRevenue: payments.reduce(
        (sum, p) => sum + p.consultationFee,
        0
      ),
      additionalRevenue: 0,
    };

    payments.forEach((payment) => {
      if (payment.paymentMethod) {
        stats.byMethod[payment.paymentMethod] += payment.totalPaid;
      }

      if (Array.isArray(payment.additionalCharges)) {
        const charges = payment.additionalCharges;
        stats.additionalRevenue += charges.reduce(
          (sum, charge) => sum + (charge.amount || 0),
          0
        );
      }
    });

    return stats;
  },
};
