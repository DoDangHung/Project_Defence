import * as UserModel from '../models/user.model.js';
import prisma from '../config/db.js';

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.json({ success: true, data: users });
    console.log(users);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, gender, role } = req.body;

    // Tìm role tương ứng trong bảng Role
    const existingRole = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!existingRole) {
      return res.status(400).json({
        success: false,
        message: `Role '${role}' does not exist. Please create it first.`,
      });
    }

    // Tạo user với quan hệ role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        phone,
        gender,

        role: {
          connect: { id: existingRole.id },
        },
      },
      include: { role: true },
    });
    console.log(user);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, phone, gender } = req.body;

    console.log('📩 Dữ liệu cần cập nhật:', req.body);

    const updatedUser = await UserModel.updateUser(id, {
      name,
      password,
      phone,
      gender,
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
    console.error('❌ Lỗi khi xoa user:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
