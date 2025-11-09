import prisma from '../config/db.js';

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const createUser = async (data) => {
  return prisma.user.create({ data });
};

export const getUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};
