import prisma from '../../config/db.js';

export const patientService = {
  book: async ({ patientId, doctorId, date, startTime, endTime, reason }) => {
    const patient = await prisma.patient.findUnique({
      where: { id: Number(patientId) },
    });
    if (!patient) throw new Error('Patient does not exist');

    const dateObj = new Date(date);
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(dateObj) || isNaN(start) || isNaN(end)) {
      throw new Error('Invalid date format');
    }

    const patientConflict = await prisma.appointment.findFirst({
      where: {
        patientId: Number(patientId),
        date: dateObj,
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });
    if (patientConflict) {
      throw new Error('Patient already has an appointment in this timeslot');
    }

    const doctorConflict = await prisma.appointment.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });
    if (doctorConflict) {
      throw new Error('This slot has already been booked');
    }

    return prisma.appointment.create({
      data: {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        date: dateObj,
        startTime: start,
        endTime: end,
        reason,
        status: 'pending',
      },
    });
  },
};
