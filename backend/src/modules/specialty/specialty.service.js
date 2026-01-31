const { PrismaClient } = require('@prisma/client');
const { deleteImage } = require('../../config/cloudinary');
const prisma = new PrismaClient();

class SpecialtyService {
  // Lấy tất cả chuyên khoa (có filter, pagination, sort)
  async getAllSpecialties(filters = {}) {
    const {
      page = 1,
      limit = 40,
      search = '',
      isActive,
      sortBy = 'priority',
      sortOrder = 'asc',
    } = filters;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true' || isActive === true;
    }

    // Get data with pagination
    const [specialties, total] = await Promise.all([
      prisma.specialty.findMany({
        where,
        skip,
        take,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          _count: {
            select: {
              doctors: true,
              clinics: true,
            },
          },
        },
      }),
      prisma.specialty.count({ where }),
    ]);

    return {
      data: specialties,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  // Lấy chuyên khoa theo ID
  async getSpecialtyById(id) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
      include: {
        doctors: {
          where: { isActive: true },
          select: {
            id: true,
            fullName: true,
            avatar: true,
            title: true,
            rating: true,
          },
        },
        clinics: {
          include: {
            clinic: {
              select: {
                id: true,
                name: true,
                slug: true,
                address: true,
                city: true,
                logo: true,
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            clinics: true,
          },
        },
      },
    });

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    return specialty;
  }

  // Lấy chuyên khoa theo slug
  async getSpecialtyBySlug(slug) {
    const specialty = await prisma.specialty.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: { isActive: true },
          take: 10,
          orderBy: { rating: 'desc' },
        },
        clinics: {
          include: {
            clinic: true,
          },
          take: 10,
        },
        _count: {
          select: {
            doctors: true,
            clinics: true,
          },
        },
      },
    });

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    return specialty;
  }

  // Tạo chuyên khoa mới (với upload ảnh)
  async createSpecialty(data, files = {}) {
    const {
      name,
      slug,
      description,
      isActive,
      priority,
      icon: iconUrl,
      image: imageUrl,
    } = data;

    // Check unique name
    const existingName = await prisma.specialty.findUnique({
      where: { name },
    });
    if (existingName) {
      throw new Error('Specialty name already exists');
    }

    // Check unique slug
    const existingSlug = await prisma.specialty.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new Error('Specialty slug already exists');
    }

    // Get uploaded file URLs from Cloudinary
    const icon = files.icon ? files.icon[0].path : iconUrl || null;
    const image = files.image ? files.image[0].path : imageUrl || null;

    const specialty = await prisma.specialty.create({
      data: {
        name,
        slug,
        description,
        icon,
        image,
        isActive: isActive !== undefined ? isActive : true,
        priority: priority ? parseInt(priority) : 0,
      },
    });

    return specialty;
  }

  // Cập nhật chuyên khoa (với upload ảnh mới)
  async updateSpecialty(id, data, files = {}) {
    const { name, slug, description, isActive, priority } = data;

    // Check if specialty exists
    const existing = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      throw new Error('Specialty not found');
    }

    // Check unique name (nếu thay đổi)
    if (name && name !== existing.name) {
      const existingName = await prisma.specialty.findUnique({
        where: { name },
      });
      if (existingName) {
        throw new Error('Specialty name already exists');
      }
    }

    // Check unique slug (nếu thay đổi)
    if (slug && slug !== existing.slug) {
      const existingSlug = await prisma.specialty.findUnique({
        where: { slug },
      });
      if (existingSlug) {
        throw new Error('Specialty slug already exists');
      }
    }

    // Handle image updates
    let icon = existing.icon;
    let image = existing.image;

    if (files.icon && files.icon[0]) {
      // Xóa icon cũ từ Cloudinary
      if (existing.icon) {
        await deleteImage(existing.icon);
      }
      icon = files.icon[0].path;
    }

    if (files.image && files.image[0]) {
      // Xóa image cũ từ Cloudinary
      if (existing.image) {
        await deleteImage(existing.image);
      }
      image = files.image[0].path;
    }

    const specialty = await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        icon,
        image,
        ...(isActive !== undefined && {
          isActive: isActive === 'true' || isActive === true,
        }),
        ...(priority !== undefined && { priority: parseInt(priority) }),
      },
    });

    return specialty;
  }

  // Xóa chuyên khoa (soft delete hoặc hard delete + xóa ảnh)
  async deleteSpecialty(id, hardDelete = false) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            doctors: true,
            clinics: true,
          },
        },
      },
    });

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    // Kiểm tra xem có doctor hoặc clinic liên quan không
    if (specialty._count.doctors > 0 || specialty._count.clinics > 0) {
      if (hardDelete) {
        throw new Error(
          'Cannot delete specialty with related doctors or clinics',
        );
      }
      // Soft delete
      return await prisma.specialty.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
    }

    // Hard delete nếu không có quan hệ
    if (hardDelete) {
      // Xóa ảnh từ Cloudinary trước
      if (specialty.icon) {
        await deleteImage(specialty.icon);
      }
      if (specialty.image) {
        await deleteImage(specialty.image);
      }

      await prisma.specialty.delete({
        where: { id: parseInt(id) },
      });
      return { message: 'Specialty deleted successfully' };
    }

    // Soft delete
    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
  }

  // Lấy chuyên khoa phổ biến (theo số lượng doctor)
  async getPopularSpecialties(limit = 10) {
    const specialties = await prisma.specialty.findMany({
      where: { isActive: true },
      take: parseInt(limit),
      orderBy: {
        doctors: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            doctors: true,
            clinics: true,
          },
        },
      },
    });

    return specialties;
  }

  // Cập nhật priority (sắp xếp)
  async updatePriority(id, priority) {
    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { priority: parseInt(priority) },
    });
  }

  // Toggle active status
  async toggleActive(id) {
    const specialty = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
    });

    if (!specialty) {
      throw new Error('Specialty not found');
    }

    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { isActive: !specialty.isActive },
    });
  }
}

module.exports = new SpecialtyService();
