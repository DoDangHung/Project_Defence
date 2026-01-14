const userService = require('../users/user.service.js');

// POST /api/users/admin
const createAdmin = async (req, res) => {
  try {
    const admin = await userService.createAdmin(req.body);

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating admin',
      error: error.message,
    });
  }
};

// POST /api/users/doctor
const createDoctor = async (req, res) => {
  try {
    const doctor = await userService.createDoctor(req.body);

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating doctor',
      error: error.message,
    });
  }
};

// POST /api/users/patient
const createPatient = async (req, res) => {
  try {
    const patient = await userService.createPatient(req.body);

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating patient',
      error: error.message,
    });
  }
};

// POST /api/users/nurse
const createNurse = async (req, res) => {
  try {
    const nurse = await userService.createNurse(req.body);

    res.status(201).json({
      success: true,
      message: 'Nurse created successfully',
      data: nurse,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating nurse',
      error: error.message,
    });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const result = await userService.getAllUsers(filters);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    // Nếu upload avatar mới -> lưu url cloudinary
    if (req.file) {
      req.body.avatar = req.file.path;
    }

    const user = await userService.updateUser(id, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// PUT /api/users/:id/password
const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required',
      });
    }

    const result = await userService.changePassword(
      id,
      oldPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// GET /api/users/statistics
const getUserStatistics = async (req, res) => {
  try {
    const statistics = await userService.getUserStatistics();

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: statistics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user statistics',
      error: error.message,
    });
  }
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
