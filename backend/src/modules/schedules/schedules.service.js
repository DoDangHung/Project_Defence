import prisma from '../../config/db.js';

export const schedulesService = {
  createSchedules: async (data) => {
    const { doctorId, date, startTime, endTime } = data;

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

    return prisma.schedule.create({
      data: {
        doctorId: Number(doctorId),
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
  },

  getSchedulesByDoctor: async (doctorId) => {
    return prisma.schedule.findMany({
      where: { doctorId: Number(doctorId) },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  },

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
};
