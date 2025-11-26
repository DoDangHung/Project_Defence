import prisma from '../../config/db.js';
import { generateTimeSlots } from '../../utils/slotGenerator.js';

export const appointmentService = {
  //service
  getAvailableSlots: async (doctorId, date, duration = 30) => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

    const avail = await prisma.availability.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
      },
    });

    if (!avail) throw new Error('Doctor has no availability on this date.');

    const allSlots = generateTimeSlots(avail.start, avail.end, duration);

    const booked = await prisma.appointment.findMany({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const availableSlots = allSlots.filter(
      (slot) =>
        !booked.some(
          (b) => slot.startTime < b.endTime && slot.endTime > b.startTime // FIX: && thay vì &
        )
    );

    return availableSlots;
  },

  getDoctorBySlots: async (doctorId, date, duration = 30) => {
    const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);

    const availability = await prisma.availability.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
      },
    });

    if (!availability)
      throw new Error('Doctor has no availability on this slot.');

    const allSlots = generateTimeSlots(
      availability.start,
      availability.end,
      duration
    );

    const bookedSlots = await prisma.appointment.findMany({
      where: { doctorId: Number(doctorId), date: dateObj },
      include: { patient: true },
    });

    const slots = allSlots.map((slot) => {
      const match = bookedSlots.find(
        (b) => slot.startTime < b.endTime && slot.endTime > b.startTime // FIX
      );
      return {
        ...slot,
        status: match ? 'booked' : 'available',
        bookingInfo: match || null,
      };
    });

    return slots;
  },

  cancelSlot: async (appointmentId) => {
    return prisma.appointment.update({
      where: { id: Number(appointmentId) },
      data: {
        status: 'cancelled',
      },
    });
  },
};
