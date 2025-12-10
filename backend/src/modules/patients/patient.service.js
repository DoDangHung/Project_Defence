import prisma from '../../config/db.js';

export const patientService = {
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
