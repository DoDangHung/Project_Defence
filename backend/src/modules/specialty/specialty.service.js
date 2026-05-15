/** @format */

import prisma from "../../config/db.js";
import { deleteImageFromCloudinary as deleteImage } from "../../utils/cloudinaryHelper.js";

const SpecialtyService = {
  // Lấy tất cả chuyên khoa (có filter, pagination, sort)
  getAllSpecialties: async (filters = {}) => {
    const {
      page = 1,
      limit = 40,
      search = "",
      isActive,
      sortBy = "priority",
      sortOrder = "asc",
      categoryId,
      categorySlug,
    } = filters;

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    // Build where clause
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive === "true" || isActive === true;
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }
    if (categorySlug) {
      where.category = { slug: categorySlug };
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
  },

  // Lấy chuyên khoa theo ID
  getSpecialtyById: async (id) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error("Invalid specialty ID");
    }

    const specialty = await prisma.specialty.findUnique({
      where: { id: parsedId },
      include: {
        doctors: {
          where: { isActive: true },
          select: {
            id: true,
            specialization: true,
            rating: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
              },
            },
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
      throw new Error("Specialty not found");
    }

    return specialty;
  },

  // Lấy chuyên khoa theo slug
  getSpecialtyBySlug: async (slug) => {
    const specialty = await prisma.specialty.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: { isActive: true },
          take: 10,
          orderBy: { rating: "desc" },
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
      throw new Error("Specialty not found");
    }

    return specialty;
  },

  // Lấy chi tiết chuyên khoa: doctors + clinics + schedules + insurances
  getSpecialtyDetail: async (slug, filters = {}) => {
    const { city, date } = filters;
    const dateFilter = date ? new Date(date) : null;
    const whereClinic = city ? { city } : {};

    const specialty = await prisma.specialty.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        description: true,
        image: true,
        _count: {
          select: { doctors: true, clinics: true },
        },
      },
    });

    if (!specialty) {
      throw new Error("Specialty not found");
    }

    // Lấy clinic IDs thuộc specialty này
    const clinicSpecialties = await prisma.clinicSpecialty.findMany({
      where: { specialtyId: specialty.id },
      select: { clinicId: true },
    });
    const clinicIds = clinicSpecialties.map((cs) => cs.clinicId);

    // Lấy doctor IDs đã gán trực tiếp vào specialty (many-to-many)
    const directDoctorIds = await prisma.specialty
      .findUnique({ where: { id: specialty.id } })
      .doctors()
      .then((docs) => docs.filter((d) => d.isActive).map((d) => d.id));

    // Lấy doctor IDs từ các clinic thuộc specialty (chỉ những clinic được gán với specialty này)
    const clinicDoctorIds =
      clinicIds.length > 0
        ? await prisma.doctorClinicAssignment.findMany({
            where: {
              clinicId: { in: clinicIds }, // CHỈ lấy từ clinics thuộc specialty
              status: "active",
              ...(city ? { clinic: whereClinic } : {}),
            },
            select: { doctorId: true },
          })
        : [];

    const allDoctorIds = [
      ...new Set([
        ...directDoctorIds,
        ...clinicDoctorIds.map((d) => d.doctorId),
      ]),
    ];

    if (allDoctorIds.length === 0) {
      return { data: { specialty, doctors: [], clinics: [] } };
    }

    const doctorWhere = { 
      id: { in: allDoctorIds }, 
      isActive: true,
      clinicAssignments: {
        some: {
          status: "active",
          clinicId: { in: clinicIds } // CHỈ lấy doctors thuộc clinics của specialty
        }
      }
    };
    if (city) {
      doctorWhere.clinicAssignments = {
        some: { status: "active", clinic: whereClinic },
      };
    }

    const doctorsRaw = await prisma.doctor.findMany({
      where: doctorWhere,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
          },
        },
        clinicAssignments: {
          where: {
            status: "active",
            clinicId: { in: clinicIds }, // CHỈ lấy clinics thuộc specialty này
            ...(city ? { clinic: whereClinic } : {}),
          },
          include: {
            clinic: {
              select: {
                id: true,
                name: true,
                address: true,
                ward: true,
                district: true,
                city: true,
                latitude: true,
                acceptedInsurances: true,
                logo: true,
                openingTime: true,
                closingTime: true,
              },
            },
            room: true,
          },
        },
        schedules: dateFilter
          ? {
              where: {
                date: {
                  gte: new Date(date + "T00:00:00.000Z"),
                  lt: new Date(date + "T23:59:59.999Z"),
                },
                isAvailable: true,
                // Ẩn lịch đã qua giờ (cho ngày hôm nay)
                startTime: {
                  gt: date === new Date().toISOString().split("T")[0] 
                    ? new Date() 
                    : new Date(date + "T00:00:00.000Z"),
                },
              },
              include: {
                clinic: { select: { id: true, name: true, address: true } },
                room: { select: { id: true, roomNumber: true } },
              },
              take: 20,
              orderBy: { startTime: "asc" },
            }
          : {
              where: { isAvailable: true },
              take: 10,
              orderBy: { date: "asc" },
              include: {
                clinic: { select: { id: true, name: true, address: true } },
                room: { select: { id: true, roomNumber: true } },
              },
            },
      },
      take: 50,
    });

    const doctors = doctorsRaw.map((doc) => {
      // Generate sub-slots from schedules
      const allSlots = [];

      if (doc.schedules && doc.schedules.length > 0) {
        for (const schedule of doc.schedules) {
          const startTime = new Date(schedule.startTime);
          const endTime = new Date(schedule.endTime);
          const slotDuration = schedule.slotDuration || 30; // minutes

          let currentTime = new Date(startTime);
          let slotIndex = 1;

          while (currentTime < endTime) {
            const slotEnd = new Date(
              currentTime.getTime() + slotDuration * 60000, // slotDuration phút -> ms
            );

            // Don't exceed end time
            if (slotEnd > endTime) break;

            const startStr = currentTime.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endStr = slotEnd.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            allSlots.push({
              id: `${schedule.id}-${slotIndex}`,
              scheduleId: schedule.id,
              date: schedule.date,
              startTime: currentTime.toISOString(),
              endTime: slotEnd.toISOString(),
              time: `${startStr} - ${endStr}`,
              clinic: schedule.clinic,
              room: schedule.room,
              isAvailable: schedule.isAvailable,
            });

            currentTime = slotEnd;
            slotIndex++;
          }
        }
      }

      return {
        id: doc.id,
        user: doc.user,
        specialization: doc.specialization,
        experience: doc.experience,
        bio: doc.bio,
        rating: doc.rating,
        clinics: doc.clinicAssignments.map((a) => ({
          id: a.clinic.id,
          name: a.clinic.name,
          address: a.clinic.address,
          ward: a.clinic.ward,
          district: a.clinic.district,
          city: a.clinic.city,
          logo: a.clinic.logo,
          openingTime: a.clinic.openingTime,
          closingTime: a.clinic.closingTime,
          acceptedInsurances: a.clinic.acceptedInsurances,
          room: a.room,
        })),
        schedules: allSlots.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime),
        ),
      };
    });

    const clinicSet = new Map();
    for (const doc of doctors) {
      for (const clinic of doc.clinics) {
        if (!clinicSet.has(clinic.id)) {
          clinicSet.set(clinic.id, clinic);
        }
      }
    }
    const clinics = Array.from(clinicSet.values()).slice(0, 20);

    return { data: { specialty, doctors, clinics } };
  },

  // Tạo chuyên khoa mới (với upload ảnh)
  createSpecialty: async (data, files = {}) => {
    const {
      name,
      slug,
      description,
      isActive,
      priority,
      icon: iconUrl,
      image: imageUrl,
      categoryId,
    } = data;

    // Check unique name
    const existingName = await prisma.specialty.findFirst({
      where: { name, categoryId: categoryId ? parseInt(categoryId) : null },
    });
    if (existingName) {
      throw new Error("Specialty name already exists");
    }

    // Check unique slug
    const slugToUse = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existingSlug = await prisma.specialty.findFirst({
      where: { slug: slugToUse },
    });
    if (existingSlug) {
      throw new Error("Specialty slug already exists");
    }

    // Get uploaded file URLs from Cloudinary
    const icon = files.icon ? files.icon[0].path : iconUrl || null;
    const image = files.image ? files.image[0].path : imageUrl || null;

    const specialty = await prisma.specialty.create({
      data: {
        name,
        slug: slugToUse,
        description,
        icon,
        image,
        isActive: isActive !== undefined ? isActive : true,
        priority: priority ? parseInt(priority) : 0,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    return specialty;
  },

  // Cập nhật chuyên khoa (với upload ảnh mới)
  updateSpecialty: async (id, data, files = {}) => {
    const { name, slug, description, isActive, priority, categoryId, icon: iconUrl, image: imageUrl, removeIcon, removeImage } = data;

    // Check if specialty exists
    const existing = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existing) {
      throw new Error("Specialty not found");
    }

    // Check unique name (nếu thay đổi)
    if (name && name !== existing.name) {
      const existingName = await prisma.specialty.findFirst({
        where: { name, categoryId: categoryId ? parseInt(categoryId) : existing.categoryId },
      });
      if (existingName) {
        throw new Error("Specialty name already exists");
      }
    }

    // Check unique slug (nếu thay đổi)
    if (slug && slug !== existing.slug) {
      const existingSlug = await prisma.specialty.findFirst({
        where: { slug },
      });
      if (existingSlug) {
        throw new Error("Specialty slug already exists");
      }
    }

    // Handle image updates
    let icon = existing.icon;
    let image = existing.image;

    // User explicitly removed icon
    if (removeIcon === 'true' || removeIcon === true) {
      if (existing.icon) {
        await deleteImage(existing.icon);
      }
      icon = null;
    } else if (files.icon && files.icon[0]) {
      // Upload new icon
      if (existing.icon) {
        await deleteImage(existing.icon);
      }
      icon = files.icon[0].path;
    } else if (iconUrl && iconUrl !== existing.icon) {
      // Keep provided URL (existing icon stays unchanged)
      icon = iconUrl;
    }

    // User explicitly removed image
    if (removeImage === 'true' || removeImage === true) {
      if (existing.image) {
        await deleteImage(existing.image);
      }
      image = null;
    } else if (files.image && files.image[0]) {
      // Upload new image
      if (existing.image) {
        await deleteImage(existing.image);
      }
      image = files.image[0].path;
    } else if (imageUrl && imageUrl !== existing.image) {
      // Keep provided URL (existing image stays unchanged)
      image = imageUrl;
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
          isActive: isActive === "true" || isActive === true,
        }),
        ...(priority !== undefined && { priority: parseInt(priority) }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
      },
    });

    return specialty;
  },

  // Xóa chuyên khoa (soft delete hoặc hard delete + xóa ảnh)
  deleteSpecialty: async (id, hardDelete = false) => {
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
      throw new Error("Specialty not found");
    }

    // Kiểm tra xem có doctor hoặc clinic liên quan không
    if (specialty._count.doctors > 0 || specialty._count.clinics > 0) {
      if (hardDelete) {
        throw new Error(
          "Cannot delete specialty with related doctors or clinics",
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
      return { message: "Specialty deleted successfully" };
    }

    // Soft delete
    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });
  },

  // Lấy chuyên khoa phổ biến (theo số lượng doctor)
  getPopularSpecialties: async (limit = 10) => {
    const specialties = await prisma.specialty.findMany({
      where: { isActive: true },
      take: parseInt(limit),
      orderBy: {
        doctors: {
          _count: "desc",
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
  },

  // Cập nhật priority (sắp xếp)
  updatePriority: async (id, priority) => {
    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { priority: parseInt(priority) },
    });
  },

  // Toggle active status
  toggleActive: async (id) => {
    const specialty = await prisma.specialty.findUnique({
      where: { id: parseInt(id) },
    });

    if (!specialty) {
      throw new Error("Specialty not found");
    }

    return await prisma.specialty.update({
      where: { id: parseInt(id) },
      data: { isActive: !specialty.isActive },
    });
  },

  // Lấy chuyên khoa theo clinic (dùng cho booking)
  getSpecialtiesByClinic: async (clinicId) => {
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
      include: {
        specialties: {
          include: {
            specialty: {
              include: {
                _count: {
                  select: {
                    doctors: true,
                    clinics: true,
                  },
                },
              },
            },
          },
        },
        doctors: {
          where: { isActive: true },
          take: 3,
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
      },
    });

    if (!clinic) {
      throw new Error("Clinic not found");
    }

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        logo: clinic.logo,
        address: clinic.address,
        ward: clinic.ward,
        district: clinic.district,
        city: clinic.city,
        phone: clinic.phone,
        openingTime: clinic.openingTime,
        closingTime: clinic.closingTime,
        category: clinic.category,
      },
      specialties: clinic.specialties.map((cs) => ({
        id: cs.specialty.id,
        name: cs.specialty.name,
        slug: cs.specialty.slug,
        description: cs.specialty.description,
        image: cs.specialty.image,
        icon: cs.specialty.icon,
        doctorCount: cs.specialty._count.doctors,
      })),
    };
  },

  // Lấy chuyên khoa theo clinic slug (dùng cho booking)
  getSpecialtiesByClinicSlug: async (clinicSlug) => {
    const clinic = await prisma.clinic.findUnique({
      where: { slug: clinicSlug },
      include: {
        specialties: {
          include: {
            specialty: {
              include: {
                _count: {
                  select: {
                    doctors: true,
                    clinics: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!clinic) {
      throw new Error("Clinic not found");
    }

    return {
      clinic: {
        id: clinic.id,
        name: clinic.name,
        slug: clinic.slug,
        logo: clinic.logo,
        address: clinic.address,
        ward: clinic.ward,
        district: clinic.district,
        city: clinic.city,
        phone: clinic.phone,
        openingTime: clinic.openingTime,
        closingTime: clinic.closingTime,
        category: clinic.category,
      },
      specialties: clinic.specialties.map((cs) => ({
        id: cs.specialty.id,
        name: cs.specialty.name,
        slug: cs.specialty.slug,
        description: cs.specialty.description,
        image: cs.specialty.image,
        icon: cs.specialty.icon,
        doctorCount: cs.specialty._count.doctors,
      })),
    };
  },

  // Lấy chuyên khoa theo category
  getSpecialtiesByCategory: async (categorySlug) => {
    const category = await prisma.serviceCategory.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const specialties = await prisma.specialty.findMany({
      where: {
        categoryId: category.id,
        isActive: true,
      },
      orderBy: { priority: 'asc' },
      include: {
        _count: {
          select: {
            doctors: true,
            clinics: true,
          },
        },
      },
    });

    return {
      category,
      specialties,
    };
  },
};

export default SpecialtyService;
