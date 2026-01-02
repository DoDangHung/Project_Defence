import prisma from '../../config/db.js';

export const patientService = {
  getAllPatients: async (filters = {}) => {
    const { page = 1, limit = 10, search, gender, condition } = filters;

    const where = {};

    // Filter theo gender
    if (gender) where.gender = gender;

    // Filter theo condition
    if (condition)
      where.condition = { contains: condition, mode: 'insensitive' };

    // Search theo user info (firstName, lastName, email, phone)
    if (search) {
      where.user = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      };
    }
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              gender: true,
              dateOfBirth: true,
              streetAddress: true,
              city: true,
              state: true,
              postalCode: true,
              avatar: true,
              status: true,
              createdAt: true,
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          id: 'desc',
        },
      }),
      prisma.patient.count({ where }),
    ]);

    return {
      data: patients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getProfile: async (patientId) => {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(patientId) },
      include: {
        user: true,
      },
    });
    if (!patient) throw new Error('Patient not found');
    return patient;
  },

  updateProfile: async (patientId, data) => {
    const patient = await prisma.patient.findUnique({
      where: {
        id: Number(patientId),
      },
    });
    if (!patient) throw new Error('Patient not found');
    return prisma.patient.update({
      where: { id: Number(patientId) },
      data: {
        address: data.address || patient.address,
      },
    });
  },

  getAppointments: async (patientId) => {
    return prisma.appointment.findMany({
      where: { patientId: Number(patientId) },
      include: { doctor: true },
      orderBy: { startTime: 'asc' },
    });
  },

  getUpcomingAppointments: async (patientId) => {
    const now = new Date();

    return prisma.appointment.findMany({
      where: {
        patientId: Number(patientId),
        startTime: { gte: now },
        status: { not: 'cancelled' },
      },
      include: { doctor: true },
      orderBy: { startTime: 'asc' },
    });
  },

  getPastAppointments: async (patientId) => {
    const now = new Date();

    return prisma.appointment.findMany({
      where: {
        patientId: Number(patientId),
        endTime: { lt: now },
      },
      include: {
        doctor: true,
      },
      orderBy: { endTime: 'desc' },
    });
  },

  getPayments: async (patientId) => {
    return prisma.payment.findMany({
      where: { appointment: { patientId: Number(patientId) } },
      include: { appointment: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  deletePatient: async (userId) => {
    return prisma.patient.delete({
      where: { userId: Number(userId) },
    });
  },
};
