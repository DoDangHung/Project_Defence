import prisma from '../config/db.js';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      role: true,
      patient: true,
      admin: true,
    },
  });
};

export const createUser = async (data) => {
  return prisma.user.create({ data, include: { role: true } });
};

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    include: { role: true, patient: true, admin: true },
  });
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

export const deleteUser = async (userId) => {
  const id = Number(userId);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      patient: true,
      admin: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // ======================================================
  // CASE 1: USER IS PATIENT
  // ======================================================
  if (user.patient) {
    const patientId = user.patient.id;

    // 1. Delete related appointments
    await prisma.appointment.deleteMany({
      where: { patientId },
    });

    // 2. Delete related medical records
    await prisma.medicalRecord.deleteMany({
      where: { patientId },
    });

    // 3. Delete prescriptions
    await prisma.prescription.deleteMany({
      where: { patientId },
    });

    // 4. Delete payments
    await prisma.payment.deleteMany({
      where: { patientId },
    });

    // 5. Delete patient
    await prisma.patient.delete({
      where: { id: patientId },
    });
  }

  // ======================================================
  // CASE 2: USER IS ADMIN
  // ======================================================
  if (user.admin) {
    await prisma.admin.delete({
      where: { id: user.admin.id },
    });
  }

  // ======================================================
  // DELETE USER FINALLY
  // ======================================================
  await prisma.user.delete({
    where: { id },
  });

  return { message: 'User deleted successfully!' };
};
