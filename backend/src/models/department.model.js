import prisma from '../config/db.js';

export const getAllDepartment = async (doctorId) => {
  const where = doctorId
    ? {
        doctors: {
          some: { id: Number(doctorId) },
        },
      }
    : {};

  return prisma.department.findMany({
    where,
    include: { doctors: true },
  });
};

export const createDepartment = async (data) => {
  return prisma.department.create({
    data,
    include: { doctors: true },
  });
};
