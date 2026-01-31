import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import userService from '../users/user.service.js';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const authService = {
  // Login user
  login: async (email, password) => {
    // Tìm user theo email, include role và các relations
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        admin: true,
        doctor: true,
        patient: true,
        nurse: true,
      },
    });

    // Check user tồn tại
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check account status
    if (user.status !== 'active') {
      throw new Error('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        doctorId: user.doctor ? user.doctor.id : null,
        // doctorId: user.doctor?.id, // ← Thêm doctorId
        adminId: user.admin?.id, // ← Thêm adminId
        patientId: user.patient?.id, // ← Thêm patientId
        nurseId: user.nurse?.[0]?.id, // ← Thêm nurseId
        roleName: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    // Chuẩn bị response data
    const { password: _, ...userWithoutPassword } = user;

    // Thêm specific ID dựa trên role
    let specificData = {};
    if (user.doctor) {
      specificData.doctorId = user.doctor.id;
    } else if (user.admin) {
      specificData.adminId = user.admin.id;
    } else if (user.patient) {
      specificData.patientId = user.patient.id;
    } else if (user.nurse && user.nurse.length > 0) {
      specificData.nurseId = user.nurse[0].id;
    }

    return {
      token,
      user: {
        ...userWithoutPassword,
        ...specificData,
      },
    };
  },

  // Get current user by ID
  getCurrentUser: async (userId) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    // Thêm specific ID
    let specificData = {};
    if (user.doctor) {
      specificData.doctorId = user.doctor.id;
    } else if (user.admin) {
      specificData.adminId = user.admin.id;
    } else if (user.patient) {
      specificData.patientId = user.patient.id;
    } else if (user.nurse && user.nurse.length > 0) {
      specificData.nurseId = user.nurse[0].id;
    }

    return {
      ...userWithoutPassword,
      ...specificData,
    };
  },

  // Verify token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },

  // Refresh token (optional)
  refreshToken: async (oldToken) => {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);

    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
        roleId: decoded.roleId,
        roleName: decoded.roleName,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    return newToken;
  },

  //POST register user
  registerUser: async (data) => {
    const user = await userService.createPatient(data);
    const payload = { id: user.id, role: user.roleId };

    return {
      user,
      accessToken: generateAccessToken(payload),
    };
  },
};

export default authService;
