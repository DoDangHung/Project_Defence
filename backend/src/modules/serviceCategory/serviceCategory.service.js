import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default {
  async getAll({ isActive } = {}) {
    const where = {};
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    return prisma.serviceCategory.findMany({
      where,
      orderBy: { priority: 'asc' },
      include: {
        _count: {
          select: {
            clinics: true,
            specialties: true,
          },
        },
      },
    });
  },

  // Lấy categories kèm theo specialties (dùng cho booking/admin)
  async getAllWithSpecialties({ isActive } = {}) {
    const where = {};
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const categories = await prisma.serviceCategory.findMany({
      where,
      orderBy: { priority: 'asc' },
      include: {
        specialties: {
          where: { isActive: true },
          orderBy: { priority: 'asc' },
          include: {
            _count: {
              select: {
                doctors: true,
                clinics: true,
              },
            },
          },
        },
        _count: {
          select: {
            clinics: true,
            specialties: true,
          },
        },
      },
    });

    // Map lại để đảm bảo categoryId và categorySlug được trả về trong mỗi specialty
    return categories.map(cat => ({
      ...cat,
      specialties: cat.specialties.map(spec => ({
        ...spec,
        categoryId: cat.id, // Đảm bảo categoryId được trả về
        categorySlug: cat.slug, // Thêm categorySlug để verify
      })),
    }));
  },

  async getById(id) {
    return prisma.serviceCategory.findUnique({
      where: { id },
      include: {
        specialties: {
          where: { isActive: true },
          orderBy: { priority: 'asc' },
        },
        _count: {
          select: {
            clinics: true,
            specialties: true,
          },
        },
      },
    });
  },

  async getBySlug(slug) {
    return prisma.serviceCategory.findUnique({
      where: { slug },
      include: {
        specialties: {
          where: { isActive: true },
          orderBy: { priority: 'asc' },
          include: {
            _count: {
              select: {
                doctors: true,
                clinics: true,
              },
            },
          },
        },
        _count: {
          select: {
            clinics: true,
            specialties: true,
          },
        },
      },
    });
  },

  async create(data) {
    const { name, description, icon, color, priority, isActive } = data;

    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return prisma.serviceCategory.create({
      data: {
        name,
        slug,
        description,
        icon,
        color,
        priority: priority || 0,
        isActive: isActive !== false,
      },
    });
  },

  async update(id, data) {
    const updateData = { ...data };

    if (data.name) {
      updateData.slug = data.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    return prisma.serviceCategory.update({
      where: { id },
      data: updateData,
    });
  },

  async delete(id) {
    return prisma.serviceCategory.delete({
      where: { id },
    });
  },

  async toggleStatus(id) {
    const category = await prisma.serviceCategory.findUnique({ where: { id } });
    return prisma.serviceCategory.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
  },
};
