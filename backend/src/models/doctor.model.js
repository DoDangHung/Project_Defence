import prisma from '../config/db.js';

export const getAllDoctor = async (departmentId) => {
  const where = departmentId ? { departmentId: Number(departmentId) } : {};
  return prisma.doctor.findMany({
    where,
    include: { department: true },
  });
};

export const getDoctorById = async (id) => {
  return prisma.doctor.findUnique({
    where: { id: Number(id) },
    include: {
      department: true,
      schedules: true,
      appointments: true,
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

export const searchDoctors = async ({
  q,
  departmentId,
  specialization,
  departmentName,
  minExperience,
  minRating,
  page = 1,
  limit = 10,
  sortBy = 'rating',
  order = 'desc',
}) => {
  const where = {};

  // full-text-ish search across several fields (case-insensitive contains)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { email: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q, mode: 'insensitive' } },
      { specialization: { contains: q, mode: 'insensitive' } },
      {
        department: {
          name: { contains: q, mode: 'insensitive' },
        },
      },
    ];
  }

  if (
    departmentId !== undefined &&
    departmentId !== null &&
    departmentId !== ''
  ) {
    where.departmentId = Number(departmentId);
  }

  if (departmentId) {
    where.departmentId = Number(departmentId);
  }

  if (departmentName) {
    where.department = {
      name: { contains: departmentName, mode: 'insensitive' },
    };
  }

  if (specialization) {
    // exact or partial match
    where.specialization = { contains: specialization, mode: 'insensitive' };
  }

  if (
    minExperience !== undefined &&
    minExperience !== null &&
    minExperience !== ''
  ) {
    where.experience = { gte: Number(minExperience) };
  }

  if (minRating !== undefined && minRating !== null && minRating !== '') {
    where.rating = { gte: Number(minRating) };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  // build orderBy
  const allowedSort = ['name', 'rating', 'experience', 'createdAt'];
  const sortField = allowedSort.includes(sortBy) ? sortBy : 'rating';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const [items, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: { department: true }, // include department info
      orderBy: { [sortField]: sortOrder },
      skip,
      take,
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
