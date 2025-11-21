import prisma from '../../config/db.js';

export const availabilityService = {
  create: async ({ doctorId, date, start, end }) => {
    const dateObj = new Date(date);
    const startObj = new Date(start);
    const endObj = new Date(end);

    if (startObj >= endObj) {
      throw new Error('Giờ bắt đầu phải nhỏ hơn giờ kết thúc');
    }

    // check overlap
    const overlap = await prisma.availability.findFirst({
      where: {
        doctorId: Number(doctorId),
        date: dateObj,
        AND: [{ start: { lt: endObj } }, { end: { gt: startObj } }],
      },
    });

    if (overlap) throw new Error('Bị trùng giờ với lịch khác');

    return prisma.availability.create({
      data: {
        doctorId: Number(doctorId),
        date: dateObj,
        start: startObj,
        end: endObj,
      },
    });
  },

  getByDoctor: async (doctorId) => {
    return prisma.availability.findMany({
      where: { doctorId: Number(doctorId) },
      orderBy: [{ date: 'asc' }, { start: 'asc' }],
    });
  },

  delete: async (id) => {
    return prisma.availability.delete({
      where: { id: Number(id) },
    });
  },
};
