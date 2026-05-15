/** @format */

import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";
// Tạo Admin
const userService = {
  createAdmin: async (userData) => {
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
      position,
    } = userData;

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
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
          status: "active",
        },
      });

      // Tạo Admin profile
      const admin = await tx.admin.create({
        data: {
          userId: user.id,
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
  },

  // Tạo Doctor
  createDoctor: async (userData) => {
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
      experience,
      bio,
    } = userData;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already exists");
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
          status: "active",
        },
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          specialization: specialization || "General",
          experience: experience || null,
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
  },

  // Tạo Patient
  createPatient: async (userData) => {
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
      throw new Error("Email already exists");
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
          status: "active",
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
  },
  // Lấy user theo ID
  getUserById: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: true,
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Lấy tất cả users
  getAllUsers: async (filters = {}) => {
    const { roleId, status, page = 1, limit = 10, search } = filters;

    const where = {};
    if (roleId) where.roleId = parseInt(roleId);
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
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
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
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
  },

  // Cập nhật user
  updateUser: async (id, userData = {}) => {
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
    if (avatar !== undefined) updateData.avatar = avatar; // Đường dẫn file mới

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: true,
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Đổi password
  changePassword: async (id, oldPassword, newPassword) => {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid old password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });

    return { message: "Password changed successfully" };
  },

  // Xóa user
  deleteUser: async (id) => {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return { message: "User deleted successfully" };
  },

  // Thống kê users theo role
  getUserStatistics: async () => {
    const [
      totalUsers,
      adminCount,
      doctorCount,
      patientCount,
      activeUsers,
      inactiveUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { roleId: 1 } }),
      prisma.user.count({ where: { roleId: 2 } }),
      prisma.user.count({ where: { roleId: 3 } }),
      prisma.user.count({ where: { roleId: 4 } }),
      prisma.user.count({ where: { status: "active" } }),
      prisma.user.count({ where: { status: "inactive" } }),
    ]);

    return {
      total: totalUsers,
      byRole: {
        admin: adminCount,
        doctor: doctorCount,
        patient: patientCount,
      },
      byStatus: {
        active: activeUsers,
        inactive: inactiveUsers,
      },
    };
  },

  // Lấy tất cả Admins
  getAllAdmins: async (filters = {}) => {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.admin.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.admin.count({ where }),
    ]);

    const data = admins.map((admin) => {
      const { password: _, ...userWithoutPassword } = admin.user;
      return {
        ...admin,
        user: userWithoutPassword,
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy tất cả Doctors
  getAllDoctors: async (filters = {}) => {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
          clinicAssignments: {
            include: { clinic: true, room: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.doctor.count({ where }),
    ]);

    const data = doctors.map((doctor) => {
      const { password: _, ...userWithoutPassword } = doctor.user;
      return {
        ...doctor,
        user: userWithoutPassword,
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Lấy tất cả Patients
  getAllPatients: async (filters = {}) => {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        include: {
          user: {
            include: { role: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    const data = patients.map((patient) => {
      const { password: _, ...userWithoutPassword } = patient.user;
      return {
        ...patient,
        user: userWithoutPassword,
      };
    });

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default userService;
