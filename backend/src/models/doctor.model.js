import prisma from '../config/db.js';

export const getAllDoctor = async () => {
  return prisma.doctor.findMany({
    include: { user: true, department: true },
  });
};

export const getDoctorById = async () => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: { user: true, department: true },
  });
};
export const createDoctor = async (data) => {
  return prisma.doctor.create({
    data,
    include: { user: true, department: true },
  });
};

export const updateDoctor = async (id, data) => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    data,
  });
};

export const deleteDoctor = async (id) => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
  });
};
