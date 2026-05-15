import prisma from '../../config/db.js';

export const feedbackService = {
  // Tạo feedback
  createFeedback: async (data) => {
    const {
      patientId,
      doctorId,
      appointmentId,
      rating,
      comment,
      professionalism,
      punctuality,
      communication,
      facilities,
    } = data;

    // Kiểm tra đã feedback chưa
    if (appointmentId) {
      const existing = await prisma.feedback.findUnique({
        where: { appointmentId },
      });

      if (existing) {
        throw new Error('Bạn đã đánh giá lịch hẹn này rồi');
      }
    }

    const feedback = await prisma.feedback.create({
      data: {
        patientId,
        doctorId,
        appointmentId,
        rating,
        comment,
        professionalism,
        punctuality,
        communication,
        facilities,
      },
      include: {
        patient: {
          include: { user: true },
        },
        doctor: {
          include: { user: true },
        },
        appointment: true,
      },
    });

    // Cập nhật appointment status
    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'completed' },
      });
    }

    return feedback;
  },

  // Lấy feedback của bệnh nhân
  getPatientFeedbacks: async (patientId) => {
    return prisma.feedback.findMany({
      where: { patientId },
      include: {
        doctor: {
          include: { user: true },
        },
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Lấy feedback của bác sĩ
  getDoctorFeedbacks: async (doctorId) => {
    return prisma.feedback.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: { user: true },
        },
        appointment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Lấy tất cả feedback (admin)
  getAllFeedbacks: async (filters = {}) => {
    const { page = 1, limit = 20, doctorId, rating, search } = filters;
    const skip = (page - 1) * limit;

    const where = {};
    if (doctorId) where.doctorId = parseInt(doctorId);
    if (rating) where.rating = parseInt(rating);
    if (search) {
      where.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { patient: { user: { OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ]}}},
      ];
    }

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          patient: { include: { user: true } },
          doctor: { include: { user: true } },
          appointment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.feedback.count({ where }),
    ]);

    return { feedbacks, total, page: parseInt(page), totalPages: Math.ceil(total / limit) };
  },

  // Lấy thống kê feedback của bác sĩ
  getDoctorFeedbackStats: async (doctorId) => {
    const feedbacks = await prisma.feedback.findMany({
      where: { doctorId },
      select: {
        rating: true,
        professionalism: true,
        punctuality: true,
        communication: true,
        facilities: true,
      },
    });

    if (feedbacks.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        averageProfessionalism: 0,
        averagePunctuality: 0,
        averageCommunication: 0,
        averageFacilities: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const total = feedbacks.length;
    const avg = (field) => feedbacks.reduce((sum, f) => sum + (f[field] || 0), 0) / total;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbacks.forEach((f) => {
      ratingDistribution[f.rating] = (ratingDistribution[f.rating] || 0) + 1;
    });

    return {
      totalReviews: total,
      averageRating: avg('rating'),
      averageProfessionalism: avg('professionalism'),
      averagePunctuality: avg('punctuality'),
      averageCommunication: avg('communication'),
      averageFacilities: avg('facilities'),
      ratingDistribution,
    };
  },

  // Bác sĩ reply feedback
  replyFeedback: async (feedbackId, doctorId, reply) => {
    const feedback = await prisma.feedback.findUnique({ where: { id: feedbackId } });

    if (!feedback) {
      throw new Error('Feedback not found');
    }

    if (feedback.doctorId !== doctorId) {
      throw new Error('Unauthorized');
    }

    return prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        doctorReply: reply,
        repliedAt: new Date(),
      },
    });
  },

  // Ẩn/hiện feedback (admin)
  updateFeedbackStatus: async (feedbackId, status) => {
    return prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
    });
  },
};
