import prisma from '../../config/db.js';

export const roomService = {
  createRoom: async (data) => {
    return prisma.room.create({
      data,
    });
  },

  getAllRooms: async () => {
    return prisma.room.findMany({
      include: {
        schedules: true,
        beds: true,
        admissions: true,
      },
    });
  },

  getRoomById: async (roomId) => {
    return prisma.room.findUnique({
      where: { id: Number(roomId) },
      include: {
        schedules: true,
        beds: true,
        admissions: true,
      },
    });
  },

  updateRoom: async (roomId, data) => {
    return prisma.room.update({
      where: { id: Number(roomId) },
      data,
    });
  },

  deleteRoom: async (roomId) => {
    return prisma.room.delete({
      where: { id: Number(roomId) },
    });
  },
};
