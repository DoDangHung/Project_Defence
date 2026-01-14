import prisma from '../../config/db.js';

// export const getAllDoctor = async (departmentId) => {
//   const where = departmentId ? { departmentId: Number(departmentId) } : {};

//   const doctors = await prisma.doctor.findMany({
//     where,
//     include: {
//       department: true,
//       user: {
//         include: {
//           role: true,
//         },
//       },
//     },
//   });

//   // 🔴 LOG để debug
//   console.log('Service - First doctor:', JSON.stringify(doctors[0], null, 2));
//   console.log('Service - First doctor user:', doctors[0]?.user);

//   return doctors;
// };

export const getDoctorById = async (id) => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      department: true,
      schedules: true,
      appointments: true,
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
      specialties: true, // nếu bạn dùng mảng specialties
    },
  });
};

export const getDoctorsByDepartment = async (departmentId) => {
  return prisma.doctor.findMany({
    where: { departmentId: Number(departmentId) },
    include: { department: true },
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

export const buildSearchQuery = (q) => {
  if (!q) return {};

  return {
    OR: [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { specialization: { contains: q, mode: 'insensitive' } },
      {
        department: {
          name: { contains: q, mode: 'insensitive' },
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
  const {
    departmentId,
    departmentName,
    specialization,
    minExperience,
    maxExperience,
    minRating,
    maxRating,
  } = params;

  const where = {};

  // Filter theo department ID
  if (departmentId) where.departmentId = Number(departmentId);

  // Filter theo department name
  if (departmentName) {
    where.department = {
      name: { contains: departmentName, mode: 'insensitive' },
    };
  }

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
        department: true,
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
