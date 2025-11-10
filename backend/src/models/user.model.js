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

export const updateUser = async (id, data) => {
  const existing = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!existing) return null;

  return prisma.user.update({
    where: { id: Number(id) },
    data,
    include: { role: true },
  });
};

export const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!user) return null;

  await prisma.user.delete({
    where: { id: Number(id) },
  });
  return user;
};
