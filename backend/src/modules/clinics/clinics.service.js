import prisma from '../../config/db.js';
import {
  deleteImageFromCloudinary,
  deleteMultipleImagesFromCloudinary,
} from '../../utils/cloudinaryHelper.js';

const createSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};
export const clinicService = {
  // Lấy tất cả clinics
  getAllClinics: async (filters = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      city,
      district,
      isActive,
      slug,
    } = filters;

    const where = {};

    // Filter theo city
    if (city) where.city = { contains: city, mode: 'insensitive' };

    // Filter theo district
    if (district) where.district = { contains: district, mode: 'insensitive' };

    // Filter theo isActive
    if (isActive !== undefined) where.isActive = isActive === 'true';

    //Filter theo slug
    if (slug) where.slug = { contains: slug, mode: 'insensitive' };
    // Search theo name, address, email, phone
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [clinics, total] = await Promise.all([
      prisma.clinic.findMany({
        where,
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          doctors: {
            take: 5,
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
          _count: {
            select: {
              doctors: true,
              appointments: true,
              specialties: true,
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.clinic.count({ where }),
    ]);

    return {
      data: clinics,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  //lay clinic theo specialties

  // Lấy clinic theo ID
  getClinicById: async (id) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(id) },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        appointments: {
          take: 10,
          orderBy: {
            date: 'desc',
          },
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            appointments: true,
            specialties: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    return clinic;
  },

  // Lấy clinic theo slug
  getClinicBySlug: async (slug) => {
    const clinic = await prisma.clinic.findUnique({
      where: { slug },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            appointments: true,
            specialties: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    return clinic;
  },

  getClinicById: async (id) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(id) },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        appointments: {
          take: 10,
          orderBy: {
            date: 'desc',
          },
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
            doctor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            appointments: true,
            specialties: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    return clinic;
  },

  // Lấy clinic theo slug
  getClinicBySlug: async (slug) => {
    const clinic = await prisma.clinic.findUnique({
      where: { slug },
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            doctors: true,
            appointments: true,
            specialties: true,
          },
        },
      },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    return clinic;
  },
  // TẠO CLINIC (XỬ LÝ LOGO VÀ IMAGES)
  createClinic: async (data, logoFile, imageFiles) => {
    const {
      name,
      description,
      phone,
      email,
      address,
      ward,
      district,
      city,
      latitude,
      longitude,
      openingTime,
      closingTime,
      isActive,
    } = data;

    let slug = createSlug(name);

    const existingClinic = await prisma.clinic.findUnique({
      where: { slug },
    });

    if (existingClinic) {
      const count = await prisma.clinic.count({
        where: { slug: { startsWith: slug } },
      });
      slug = `${slug}-${count + 1}`;
    }

    // Xử lý logo từ Cloudinary
    const logo = logoFile ? logoFile.path : null;

    // Xử lý multiple images từ Cloudinary
    const images =
      imageFiles && imageFiles.length > 0
        ? imageFiles.map((file) => file.path)
        : null;

    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug,
        description: description || null,
        logo: logo,
        images: images ? JSON.stringify(images) : null, // Lưu array URLs dạng JSON
        phone: phone || null,
        email: email || null,
        address,
        ward: ward || null,
        district: district || null,
        city,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        openingTime: openingTime || null,
        closingTime: closingTime || null,
        isActive: isActive === 'true' || isActive === true,
      },
    });

    return clinic;
  },

  assignSpecialtiesToClinic: async (clinicId, specialtyIds) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) throw new Error('Clinic not found');
    const existingSpecialties = await prisma.specialty.findMany({
      where: { id: { in: specialtyIds } },
      select: { id: true },
    });
    const existingIds = existingSpecialties.map((s) => s.id);

    if (existingIds.length !== specialtyIds.length) {
      throw new Error('Some specialties not found');
    }

    // 3. Gán (không bị trùng)
    await prisma.clinicSpecialty.createMany({
      data: specialtyIds.map((sid) => ({
        clinicId,
        specialtyId: sid,
      })),
      skipDuplicates: true,
    });

    return { message: 'Specialties assigned successfully' };
  },

  assignDoctorsToClinic: async (clinicId, doctorIds) => {
    // 1. Check clinic exists
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) throw new Error('Clinic not found');

    // 2. Optional: check doctors exist
    const validDoctors = await prisma.doctor.findMany({
      where: { id: { in: doctorIds } },
    });

    if (validDoctors.length !== doctorIds.length) {
      throw new Error('Some doctors not found');
    }

    // 3. Replace old relations with new ones
    await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        doctors: {
          set: doctorIds.map((id) => ({ id })),
        },
      },
    });

    return { message: 'Doctors assigned successfully' };
  },

  // Cập nhật clinic
  updateClinic: async (id, data) => {
    const {
      name,
      description,
      logo,
      images,
      phone,
      email,
      address,
      ward,
      district,
      city,
      latitude,
      longitude,
      openingTime,
      closingTime,
      isActive,
    } = data;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
      // Tạo slug mới nếu đổi tên
      updateData.slug = createSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (logo !== undefined) updateData.logo = logo;
    if (images !== undefined) updateData.images = images;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (ward !== undefined) updateData.ward = ward;
    if (district !== undefined) updateData.district = district;
    if (city !== undefined) updateData.city = city;
    if (latitude !== undefined)
      updateData.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined)
      updateData.longitude = longitude ? parseFloat(longitude) : null;
    if (openingTime !== undefined) updateData.openingTime = openingTime;
    if (closingTime !== undefined) updateData.closingTime = closingTime;
    if (isActive !== undefined) updateData.isActive = isActive;

    const clinic = await prisma.clinic.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        doctors: true,
        _count: {
          select: {
            doctors: true,
            appointments: true,
            specialties: true,
          },
        },
      },
    });

    return clinic;
  },
  // CẬP NHẬT LOGO CLINIC
  updateClinicLogo: async (clinicId, logoFile) => {
    if (!logoFile) {
      throw new Error('No logo file provided');
    }

    const oldClinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
    });

    if (!oldClinic) {
      throw new Error('Clinic not found');
    }

    // Xóa logo cũ trên Cloudinary
    if (oldClinic.logo) {
      await deleteImageFromCloudinary(oldClinic.logo);
    }

    // Cập nhật logo mới
    const clinic = await prisma.clinic.update({
      where: { id: parseInt(clinicId) },
      data: {
        logo: logoFile.path,
      },
    });

    return clinic;
  },

  // Toggle active status
  toggleClinicStatus: async (id) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    const updatedClinic = await prisma.clinic.update({
      where: { id: parseInt(id) },
      data: { isActive: !clinic.isActive },
    });

    return updatedClinic;
  },

  // Lấy danh sách bác sĩ của clinic
  getClinicDoctors: async (clinicId, filters = {}) => {
    // Debug: Kiểm tra clinicId
    console.log('clinicId received:', clinicId, typeof clinicId);

    // Validate clinicId
    if (!clinicId || isNaN(parseInt(clinicId))) {
      throw new Error('Invalid clinic ID');
    }

    const { page = 1, limit = 10, specialization } = filters;

    const parsedClinicId = parseInt(clinicId);
    console.log('parsedClinicId:', parsedClinicId);

    const where = {
      clinics: {
        some: {
          id: parsedClinicId,
        },
      },
    };

    if (specialization) {
      where.specialization = { contains: specialization, mode: 'insensitive' };
    }

    console.log('where condition:', JSON.stringify(where, null, 2));

    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              appointments: true,
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.doctor.count({ where }),
    ]);

    return {
      data: doctors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy danh sách appointments của clinic
  getClinicAppointments: async (clinicId, filters = {}) => {
    const { page = 1, limit = 10, status, date } = filters;

    const where = { clinicId: parseInt(clinicId) };

    if (status) where.status = status;

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
          doctor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          date: 'desc',
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Thống kê clinic
  getClinicStatistics: async () => {
    const [
      totalClinics,
      activeClinics,
      inactiveClinics,
      totalDoctors,
      totalAppointments,
      clinicsByCity,
    ] = await Promise.all([
      prisma.clinic.count(),
      prisma.clinic.count({ where: { isActive: true } }),
      prisma.clinic.count({ where: { isActive: false } }),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.clinic.groupBy({
        by: ['city'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
    ]);

    return {
      total: totalClinics,
      active: activeClinics,
      inactive: inactiveClinics,
      totalDoctors,
      totalAppointments,
      byCity: clinicsByCity.map((item) => ({
        city: item.city,
        count: item._count.id,
      })),
    };
  },

  // Search clinics nearby (theo tọa độ)
  searchClinicsNearby: async (latitude, longitude, radius = 10) => {
    // radius in kilometers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    // Tính khoảng cách theo công thức Haversine
    const clinics = await prisma.clinic.findMany({
      where: {
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
      },
      include: {
        _count: {
          select: {
            doctors: true,
            specialties: true,
          },
        },
      },
    });

    // Filter theo khoảng cách
    const nearbyClinics = clinics.filter((clinic) => {
      if (!clinic.latitude || !clinic.longitude) return false;

      const R = 6371; // Bán kính trái đất (km)
      const dLat = ((clinic.latitude - lat) * Math.PI) / 180;
      const dLon = ((clinic.longitude - lng) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat * Math.PI) / 180) *
          Math.cos((clinic.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      clinic.distance = distance.toFixed(2);

      return distance <= radius;
    });

    // Sắp xếp theo khoảng cách
    nearbyClinics.sort(
      (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    return nearbyClinics;
  },
  // THÊM IMAGES VÀO CLINIC GALLERY
  addClinicImages: async (clinicId, imageFiles) => {
    if (!imageFiles || imageFiles.length === 0) {
      throw new Error('No image files provided');
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Lấy images cũ
    const oldImages = clinic.images ? JSON.parse(clinic.images) : [];

    // Thêm images mới
    const newImages = imageFiles.map((file) => file.path);
    const updatedImages = [...oldImages, ...newImages];

    // Cập nhật database
    const updatedClinic = await prisma.clinic.update({
      where: { id: parseInt(clinicId) },
      data: {
        images: JSON.stringify(updatedImages),
      },
    });

    return updatedClinic;
  },

  // XÓA IMAGE KHỎI CLINIC GALLERY
  removeClinicImage: async (clinicId, imageUrl) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    const images = clinic.images ? JSON.parse(clinic.images) : [];

    // Kiểm tra image có tồn tại không
    if (!images.includes(imageUrl)) {
      throw new Error('Image not found in clinic gallery');
    }

    // Xóa trên Cloudinary
    await deleteImageFromCloudinary(imageUrl);

    // Xóa khỏi array
    const updatedImages = images.filter((img) => img !== imageUrl);

    // Cập nhật database
    const updatedClinic = await prisma.clinic.update({
      where: { id: parseInt(clinicId) },
      data: {
        images: updatedImages.length > 0 ? JSON.stringify(updatedImages) : null,
      },
    });

    return updatedClinic;
  },

  // XÓA CLINIC (XỬ LÝ XÓA LOGO VÀ IMAGES TRÊN CLOUDINARY)
  deleteClinic: async (id) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Xóa logo trên Cloudinary
    if (clinic.logo) {
      await deleteImageFromCloudinary(clinic.logo);
    }

    // Xóa tất cả images trên Cloudinary
    if (clinic.images) {
      const images = JSON.parse(clinic.images);
      await deleteMultipleImagesFromCloudinary(images);
    }

    // Xóa clinic
    await prisma.clinic.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Clinic deleted successfully' };
  },
};
