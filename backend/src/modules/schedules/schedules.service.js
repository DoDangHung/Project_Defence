import prisma from '../../config/db.js';

// schedules.service.js

export const schedulesService = {
  // Helper: Tạo slots từ startTime và endTime
  generateTimeSlots: (startTime, endTime, slotDuration = 60) => {
    const slots = [];
    let currentTime = new Date(startTime);
    const end = new Date(endTime);

    while (currentTime < end) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(
        currentTime.getTime() + slotDuration * 60 * 1000
      );

      // Đảm bảo không vượt quá endTime
      if (slotEnd <= end) {
        slots.push({
          start: slotStart,
          end: slotEnd,
        });
      }

      currentTime = slotEnd;
    }

    return slots;
  },

  // Tạo schedule
  createSchedules: async (data) => {
    const { doctorId, date, startTime, endTime, slotDuration = 60 } = data;

    // Check overlap
    const overlap = await prisma.schedule.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: new Date(date),
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime: { gt: new Date(startTime) } },
        ],
      },
    });

    if (overlap) {
      throw new Error('Bị trùng giờ với lịch khác');
    }

    // Tính số slots
    const slots = schedulesService.generateTimeSlots(
      startTime,
      endTime,
      slotDuration
    );

    // Tạo schedule
    return prisma.schedule.create({
      data: {
        doctorId: Number(doctorId),
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        slotDuration,
        totalSlots: slots.length,
      },
    });
  },

  // Lấy schedules với thông tin slots available
  getSchedulesByDoctor: async (doctorId) => {
    const schedules = await prisma.schedule.findMany({
      where: { doctorId },
      include: {
        appointments: true, // Lấy appointments đã book
      },
      orderBy: { date: 'asc' },
    });

    // Thêm thông tin slots cho mỗi schedule
    return schedules.map((schedule) => {
      const slots = schedulesService.generateTimeSlots(
        schedule.startTime,
        schedule.endTime,
        schedule.slotDuration
      );

      // Đánh dấu slot nào đã book
      const slotsWithStatus = slots.map((slot, index) => {
        const bookedAppointment = schedule.appointments.find(
          (apt) => apt.slotIndex === index
        );

        return {
          index,
          start: slot.start,
          end: slot.end,
          isBooked: !!bookedAppointment,
          appointment: bookedAppointment || null,
        };
      });

      const availableSlots = slotsWithStatus.filter((s) => !s.isBooked).length;

      return {
        ...schedule,
        slots: slotsWithStatus,
        availableSlots,
        bookedSlots: schedule.appointments.length,
      };
    });
  },

  // Các methods khác giữ nguyên...
  updateSchedules: async (id, data) => {
    return prisma.schedule.update({
      where: { id: Number(id) },
      data,
    });
  },

  deleteSchedules: async (id) => {
    return prisma.schedule.delete({
      where: { id: Number(id) },
    });
  },

  getDoctorsAndSchedules: async (clinicId) => {
    return prisma.doctor.findMany({
      where: { clinicId },
      include: {
        user: true,
        specialty: true,
        schedules: {
          orderBy: { date: 'asc' },
        },
      },
    });
  },
};
