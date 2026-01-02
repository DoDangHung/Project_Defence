const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Tạo Admin
const createAdmin = async (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    state,
    postalCode,
    department,
    position,
  } = userData;

  // Kiểm tra email đã tồn tại
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo User và Admin trong transaction
  const result = await prisma.$transaction(async (tx) => {
    // Tạo User
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        roleId: 1, // Admin role
        status: 'active',
      },
    });

    // Tạo Admin profile
    const admin = await tx.admin.create({
      data: {
        userId: user.id,
        department: department || null,
        position: position || null,
      },
    });

    return { user, admin };
  });

  // Loại bỏ password khỏi response
  const { password: _, ...userWithoutPassword } = result.user;

  return {
    ...userWithoutPassword,
    admin: result.admin,
  };
};

// Tạo Doctor
const createDoctor = async (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    state,
    postalCode,
    specialization,
    licenseNumber,
    experience,
    education,
    bio,
  } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        roleId: 2, // Doctor role
        status: 'active',
      },
    });

    const doctor = await tx.doctor.create({
      data: {
        userId: user.id,
        specialization: specialization || null,
        licenseNumber: licenseNumber || null,
        experience: experience || null,
        education: education || null,
        bio: bio || null,
      },
    });

    return { user, doctor };
  });

  const { password: _, ...userWithoutPassword } = result.user;

  return {
    ...userWithoutPassword,
    doctor: result.doctor,
  };
};

// Tạo Patient
const createPatient = async (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    state,
    postalCode,
    age,
    condition,
  } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        roleId: 3, // Patient role
        status: 'active',
      },
    });

    const patient = await tx.patient.create({
      data: {
        userId: user.id,
        age: age || null,
        condition: condition || null,
        gender: gender || null,
      },
    });

    return { user, patient };
  });

  const { password: _, ...userWithoutPassword } = result.user;

  return {
    ...userWithoutPassword,
    patient: result.patient,
  };
};

// Tạo Nurse
const createNurse = async (userData) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    state,
    postalCode,
    department,
    shift,
    licenseNumber,
  } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        streetAddress: streetAddress || null,
        city: city || null,
        state: state || null,
        postalCode: postalCode || null,
        roleId: 4, // Nurse role
        status: 'active',
      },
    });

    const nurse = await tx.nurse.create({
      data: {
        userId: user.id,
        department: department || null,
        shift: shift || null,
        licenseNumber: licenseNumber || null,
      },
    });

    return { user, nurse };
  });

  const { password: _, ...userWithoutPassword } = result.user;

  return {
    ...userWithoutPassword,
    nurse: result.nurse,
  };
};

// Lấy user theo ID
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: {
      role: true,
      admin: true,
      doctor: true,
      patient: true,
      nurse: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Lấy tất cả users
const getAllUsers = async (filters = {}) => {
  const { roleId, status, page = 1, limit = 10, search } = filters;

  const where = {};
  if (roleId) where.roleId = parseInt(roleId);
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        role: true,
        admin: true,
        doctor: true,
        patient: true,
        nurse: true,
      },
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count({ where }),
  ]);

  // Loại bỏ password
  const usersWithoutPassword = users.map((user) => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });

  return {
    data: usersWithoutPassword,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Cập nhật user
const updateUser = async (id, userData) => {
  const {
    firstName,
    lastName,
    phone,
    gender,
    dateOfBirth,
    streetAddress,
    city,
    state,
    postalCode,
    status,
    avatar,
  } = userData;

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (gender !== undefined) updateData.gender = gender;
  if (dateOfBirth !== undefined)
    updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
  if (streetAddress !== undefined) updateData.streetAddress = streetAddress;
  if (city !== undefined) updateData.city = city;
  if (state !== undefined) updateData.state = state;
  if (postalCode !== undefined) updateData.postalCode = postalCode;
  if (status) updateData.status = status;
  if (avatar !== undefined) updateData.avatar = avatar;

  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      role: true,
      admin: true,
      doctor: true,
      patient: true,
      nurse: true,
    },
  });

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Đổi password
const changePassword = async (id, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const isValidPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid old password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};

// Xóa user
const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });

  return { message: 'User deleted successfully' };
};

// Thống kê users theo role
const getUserStatistics = async () => {
  const [
    totalUsers,
    adminCount,
    doctorCount,
    patientCount,
    nurseCount,
    activeUsers,
    inactiveUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { roleId: 1 } }),
    prisma.user.count({ where: { roleId: 2 } }),
    prisma.user.count({ where: { roleId: 3 } }),
    prisma.user.count({ where: { roleId: 4 } }),
    prisma.user.count({ where: { status: 'active' } }),
    prisma.user.count({ where: { status: 'inactive' } }),
  ]);

  return {
    total: totalUsers,
    byRole: {
      admin: adminCount,
      doctor: doctorCount,
      patient: patientCount,
      nurse: nurseCount,
    },
    byStatus: {
      active: activeUsers,
      inactive: inactiveUsers,
    },
  };
};

module.exports = {
  createAdmin,
  createDoctor,
  createPatient,
  createNurse,
  getUserById,
  getAllUsers,
  updateUser,
  changePassword,
  deleteUser,
  getUserStatistics,
};
