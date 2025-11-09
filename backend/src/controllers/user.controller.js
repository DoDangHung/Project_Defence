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
    const { name, email, password, phone, role } = req.body;

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
    const { name, email, password, phone, roleId } = req.body;

    console.log('📩 Dữ liệu cần cập nhật:', req.body);

    const updatedUser = await UserModel.updateUser(id, {
      name,
      email,
      password,
      phone,
      roleId,
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
