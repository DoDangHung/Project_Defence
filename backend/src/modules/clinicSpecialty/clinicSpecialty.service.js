import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async getByClinic(clinicId) {
    const parsedId = parseInt(clinicId);
    if (isNaN(parsedId)) {
      throw new Error("Invalid clinic ID");
    }
    return prisma.clinicSpecialty.findMany({
      where: { clinicId: parsedId },
      include: {
        specialty: true,
      },
    });
  },

  async getBySpecialty(specialtyId) {
    const parsedId = parseInt(specialtyId);
    if (isNaN(parsedId)) {
      throw new Error("Invalid specialty ID");
    }
    return prisma.clinicSpecialty.findMany({
      where: { specialtyId: parsedId },
      include: {
        clinic: true,
      },
    });
  },

  async create(clinicId, specialtyId) {
    const parsedClinicId = parseInt(clinicId);
    const parsedSpecialtyId = parseInt(specialtyId);
    if (isNaN(parsedClinicId) || isNaN(parsedSpecialtyId)) {
      throw new Error("Invalid clinic ID or specialty ID");
    }
    return prisma.clinicSpecialty.create({
      data: {
        clinicId: parsedClinicId,
        specialtyId: parsedSpecialtyId,
      },
      include: {
        clinic: true,
        specialty: true,
      },
    });
  },

  async delete(clinicId, specialtyId) {
    const parsedClinicId = parseInt(clinicId);
    const parsedSpecialtyId = parseInt(specialtyId);
    if (isNaN(parsedClinicId) || isNaN(parsedSpecialtyId)) {
      throw new Error("Invalid clinic ID or specialty ID");
    }
    return prisma.clinicSpecialty.delete({
      where: {
        clinicId_specialtyId: {
          clinicId: parsedClinicId,
          specialtyId: parsedSpecialtyId,
        },
      },
    });
  },

  async assignSpecialtiesToClinic(clinicId, specialtyIds) {
    // Xóa tất cả specialty hiện tại của clinic
    await prisma.clinicSpecialty.deleteMany({
      where: { clinicId: parseInt(clinicId) },
    });

    // Tạo mới các specialty được gán
    if (specialtyIds && specialtyIds.length > 0) {
      const data = specialtyIds.map((specId) => ({
        clinicId: parseInt(clinicId),
        specialtyId: parseInt(specId),
      }));

      return prisma.clinicSpecialty.createMany({
        data,
        skipDuplicates: true,
      });
    }

    return { count: 0 };
  },
};
