import prisma from '../config/db.js';

export const getAllDoctor = async (departmentId) => {
  const doctors = departmentId ? { departmentId: Number(departmentId) } : {};
  return prisma.doctor.findMany({
    doctors,
    include: { department: true },
  });
};

export const getDoctorById = async () => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: { department: true, schedules: true, appointments: true },
  });
};
export const createDoctor = async (data) => {
  return prisma.doctor.create({
    data,
    include: { department: true },
  });
};

export const updateDoctor = async (id, data) => {
  return prisma.doctor.update({
    where: { id: Number(id) },
    data,
    include: { department: true },
  });
};

export const deleteDoctor = async (id) => {
  return prisma.doctor.delete({
    where: { id: Number(id) },
  });
};
