import * as UserModel from '../models/user.model.js';
import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({ success: true, data: users });
    console.log(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserModel.getUserById(id);

    if (!users) {
      return res.status(404).json({
        success: false,
        message: 'Users not found',
      });
    }
    return res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/UserController.js
export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      gender,
      dateOfBirth,
      streetAddress,
      city,
      state,
      postalCode,
      roleId,
      specialization,
      experience,
      bio,
      departmentId,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CASE 1: Create Doctor (roleId = 2)
    if (roleId === 2) {
      if (!specialization) {
        return res.status(400).json({
          success: false,
          message: 'Specialization is required for doctors',
        });
      }

      const doctor = await prisma.doctor.create({
        data: {
          specialization,
          experience: experience ? Number(experience) : null,
          bio: bio || null,
          rating: 0.0,

          // ✅ CORRECT: Dùng department object với connect
          department: departmentId
            ? {
                connect: { id: Number(departmentId) },
              }
            : undefined,

          // ✅ Nested create User
          user: {
            create: {
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
              roleId: 2,
              status: 'active',
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              gender: true,
              dateOfBirth: true,
              streetAddress: true,
              city: true,
              state: true,
              postalCode: true,
              roleId: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          department: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: doctor,
        message: 'Doctor created successfully',
      });
    }

    // ✅ CASE 2: Create Patient (roleId = 3)
    if (roleId === 3) {
      const patient = await prisma.patient.create({
        data: {
          bloodType: req.body.bloodType || null,
          allergies: req.body.allergies || null,

          user: {
            create: {
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
              roleId: 3,
              status: 'active',
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              gender: true,
              dateOfBirth: true,
              roleId: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        data: patient,
        message: 'Patient created successfully',
      });
    }

    // ✅ CASE 3: Create other roles (Admin, Nurse, etc.)
    const user = await prisma.user.create({
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
        roleId,
        status: 'active',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        roleId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  } catch (err) {
    console.error('Error creating user:', err);

    if (err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Invalid roleId or departmentId',
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { streetAddress, city, state, postalCode } = req.body;

    console.log('📩 Dữ liệu cần cập nhật:', req.body);

    const updatedUser = await UserModel.updateUser(id, {
      streetAddress,
      city,
      state,
      postalCode,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('deleted:', id);
    const deletedUser = await UserModel.deleteUser(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      message: 'User deleted successful',
      data: deletedUser,
    });
  } catch (error) {
    console.error('❌ Lỗi khi xoa user:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadUserAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = req.file.path;

    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { avatar: avatarUrl },
    });

    res.json({ success: true, avatar: avatarUrl, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
