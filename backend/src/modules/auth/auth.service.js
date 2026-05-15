import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import userService from '../users/user.service.js';

const loginAttempts = new Map();

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 phút
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const authService = {
  // Login user
  login: async (email, password, ip) => {
    const key = `${email}_${ip}`;
    const now = Date.now();

    const record = loginAttempts.get(key);

    // 🚫 đang bị khóa
    if (record?.lockUntil && record.lockUntil > now) {
      throw {
        status: 429,
        message: 'Too many login attempts. Try again later.',
      };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, admin: true, doctor: true, patient: true },
    });

    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      const failed = (record?.failedAttempts || 0) + 1;

      loginAttempts.set(key, {
        failedAttempts: failed,
        lockUntil: failed >= MAX_ATTEMPTS ? now + LOCK_TIME : null,
      });

      throw failed >= MAX_ATTEMPTS
        ? { status: 429, message: 'Too many login attempts' }
        : { status: 401, message: 'Invalid email or password' };
    }

    // ✅ login đúng → reset
    loginAttempts.delete(key);

    // JWT giữ nguyên code của bạn
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
        doctorId: user.doctor?.id || null,
        adminId: user.admin?.id || null,
        patientId: user.patient?.id || null,
        roleName: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    );

    const { password: _, ...userWithoutPassword } = user;

    let specificData = {};
    if (user.patient) {
      specificData.patientId = user.patient.id;
    } else if (user.doctor) {
      specificData.doctorId = user.doctor.id;
    } else if (user.admin) {
      specificData.adminId = user.admin.id;
    }

    return { token, user: { ...userWithoutPassword, ...specificData } };
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
    try {
      console.log('REGISTER DATA:', data);

      const { roleId, roleid } = data;
      const finalRoleId = roleId || roleid || 3; // Default Patient

      let user;
      if (finalRoleId === 1) {
        user = await userService.createAdmin(data);
      } else if (finalRoleId === 2) {
        user = await userService.createDoctor(data);
      } else {
        user = await userService.createPatient(data);
      }

      console.log('USER CREATED:', user);

      const payload = { id: user.id, role: user.roleId };

      return {
        user,
        accessToken: generateAccessToken(payload),
      };
    } catch (err) {
      console.error('REGISTER ERROR:', err.message);
      throw err;
    }
  },
};

export default authService;
