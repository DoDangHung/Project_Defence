import prisma from '../../config/db.js';
import xss from 'xss';

// Lấy chi tiết bác sĩ (public - chỉ hiện profile đã duyệt)
export const getDoctorPublicProfile = async (id) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          phone: true,
          email: true,
        },
      },
      clinicAssignments: {
        where: { status: 'active' },
        include: {
          clinic: true,
          room: true,
        },
      },
      feedbacks: {
        select: {
          rating: true,
          comment: true,
          createdAt: true,
          patient: {
            select: {
              user: {
                select: {
                  firstName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      specialties: true,
    },
  });

  if (!doctor) return null;

  // Chỉ hiện thông tin profile nếu đã được duyệt
  return {
    id: doctor.id,
    specialization: doctor.specialization,
    experience: doctor.experience,
    bio: doctor.bio,
    rating: doctor.rating,
    // Profile info - chỉ hiện nếu đã approve
    about: doctor.isProfileApproved ? doctor.about : null,
    education: doctor.isProfileApproved ? doctor.education : null,
    training: doctor.isProfileApproved ? doctor.training : null,
    achievements: doctor.isProfileApproved ? doctor.achievements : null,
    languages: doctor.isProfileApproved ? doctor.languages : null,
    services: doctor.isProfileApproved ? doctor.services : null,
    user: doctor.user,
    clinics: doctor.clinicAssignments.map((a) => ({
      id: a.clinic.id,
      name: a.clinic.name,
      address: a.clinic.address,
      phone: a.clinic.phone,
      room: a.room,
    })),
    feedbacks: doctor.feedbacks,
    specialties: doctor.specialties,
    stats: {
      totalFeedbacks: doctor.feedbacks.length,
      averageRating: doctor.rating || 0,
    },
  };
};

// Cập nhật profile cá nhân của bác sĩ (chờ duyệt)
export const updateDoctorProfile = async (doctorId, data) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
  });

  if (!doctor) throw new Error('Doctor not found');

  // Reset approval status khi có thay đổi
  return prisma.doctor.update({
    where: { id: doctorId },
    data: {
      about: data.about,
      education: data.education,
      training: data.training,
      achievements: data.achievements,
      languages: data.languages,
      services: data.services,
      isProfileApproved: false, // Reset để chờ duyệt lại
    },
  });
};

// Admin duyệt profile bác sĩ
export const approveDoctorProfile = async (adminId, doctorId) => {
  return prisma.doctor.update({
    where: { id: doctorId },
    data: {
      isProfileApproved: true,
      profileApprovedAt: new Date(),
      profileApprovedBy: adminId,
    },
  });
};

// Lấy danh sách bác sĩ chờ duyệt profile
export const getPendingDoctorProfiles = async () => {
  return prisma.doctor.findMany({
    where: { isProfileApproved: false },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

// Doctor Panel: Lấy profile hiện tại
export const getDoctorMyProfile = async (doctorId) => {
  return prisma.doctor.findUnique({
    where: { id: doctorId },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          phone: true,
        },
      },
    },
  });
};

export const getDoctorById = async (id) => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      schedules: true,
      appointments: true,
      clinics: true,
      user: {
        // ✅ THÊM phần này
        include: {
          role: true,
        },
      },
    },
  });
};

export const getDoctorsByClinic = async (clinicId) => {
  return prisma.doctor.findMany({
    where: {
      clinics: {
        some: {
          id: clinicId,
        },
      },
    },
    include: {
      user: true,
      specialties: true,
      clinics: true,
    },
  });
};

export const getDoctorsByDepartment = async (departmentId) => {
  return prisma.doctor.findMany({});
};

// Lấy danh sách bệnh nhân của bác sĩ (đang + đã khám)

export const getDoctorPatientsWithStats = async (doctorId) => {
  // 1. Lấy toàn bộ appointment của bác sĩ

  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: Number(doctorId),
      status: {
        not: 'cancelled',
      },
    },
    include: {
      patient: {
        select: {
          id: true,
          age: true,
          gender: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      startTime: 'desc',
    },
  });

  const patientMap = new Map();

  appointments.forEach((apt) => {
    const pid = apt.patient.id;

    if (!patientMap.has(pid)) {
      patientMap.set(pid, {
        patientId: pid,
        patient: apt.patient,
        totalVisits: 0,
        completedVisits: 0,
        upcomingVisits: 0,
        lastVisit: null,
      });
    }

    const record = patientMap.get(pid);

    record.totalVisits += 1;

    if (apt.status === 'completed') {
      record.completedVisits += 1;
    }

    if (new Date(apt.startTime) > new Date()) {
      record.upcomingVisits += 1;
    }

    if (
      !record.lastVisit ||
      new Date(apt.startTime) > new Date(record.lastVisit)
    ) {
      record.lastVisit = apt.startTime;
    }
  });

  // ===== STATS =====
  const totalPatients = patientMap.size;

  let newPatients = 0;
  let oldPatients = 0;

  patientMap.forEach((p) => {
    if (p.totalVisits === 1) newPatients++;
    if (p.totalVisits > 1) oldPatients++;
  });

  // ===== LIST =====
  const patients = Array.from(patientMap.values()).map((p) => ({
    patientId: p.patientId,
    firstName: p.patient.user.firstName,
    lastName: p.patient.user.lastName,
    phone: p.patient.user.phone,
    email: p.patient.user.email,
    age: p.patient.age,
    gender: p.patient.gender,
    totalVisits: p.totalVisits,
    completedVisits: p.completedVisits,
    upcomingVisits: p.upcomingVisits,
    lastVisit: p.lastVisit,
    status: p.totalVisits > 1 ? 'old' : 'new',
  }));

  return {
    stats: {
      totalPatients,
      newPatients,
      oldPatients,
    },
    patients,
  };
};

export const createDoctor = async (data) => {
  return prisma.doctor.create({
    data,
  });
};

export const updateDoctor = async (id, data) => {
  return prisma.doctor.update({
    where: { id: Number(id) },
    data,
  });
};

export const buildSearchQuery = (q) => {
  if (!q) return {};
  const safeQ = xss(q);
  return {
    OR: [
      {
        specialization: {
          contains: safeQ,
          mode: 'insensitive',
        },
      },
      {
        user: {
          is: {
            OR: [
              { firstName: { contains: safeQ, mode: 'insensitive' } },
              { lastName: { contains: safeQ, mode: 'insensitive' } },
              { email: { contains: safeQ, mode: 'insensitive' } },
              { phone: { contains: safeQ, mode: 'insensitive' } },
            ],
          },
        },
      },
    ],
  };
};

export const buildPagination = (page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  return { skip, take };
};

export const buildSort = (sortBy = 'createdAt', order = 'desc') => {
  const allowedSort = ['name', 'rating', 'experience', 'createdAt'];

  const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  return { [sortField]: sortOrder };
};

export const filterDoctors = (params) => {
  const { specialization, minExperience, maxExperience, minRating, maxRating } =
    params;

  const where = {};

  // Filter specialization
  if (specialization) {
    where.specialization = {
      contains: specialization,
      mode: 'insensitive',
    };
  }

  // Experience range
  if (minExperience)
    where.experience = { ...where.experience, gte: Number(minExperience) };
  if (maxExperience)
    where.experience = { ...where.experience, lte: Number(maxExperience) };

  // Rating range
  if (minRating) where.rating = { ...where.rating, gte: Number(minRating) };
  if (maxRating) where.rating = { ...where.rating, lte: Number(maxRating) };

  return where;
};

export const getFilteredDoctors = async (params) => {
  const { q, page, limit, sortBy, order, ...filters } = params;

  // Build từng phần riêng
  const whereFilter = filterDoctors(filters);
  const whereSearch = buildSearchQuery(q);
  const pagination = buildPagination(page, limit);
  const sort = buildSort(sortBy, order);

  const where = {
    AND: [whereFilter, whereSearch],
  };

  const [items, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: {
        clinics: true,
        user: {
          // ✅ THÊM DÒNG NÀY
          include: {
            role: true,
          },
        },
      },
      orderBy: sort,
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.doctor.count({ where }),
  ]);

  return {
    items,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit) || 0,
  };
};

export const deleteDoctor = async (id) => {
  return prisma.doctor.delete({
    where: { id: Number(id) },
  });
};
