import * as DoctorModel from '../doctors/doctor.service.js';
import prisma from '../../config/db.js';

export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('getDoctorById hit, params:', req.params);
    const doctor = await DoctorModel.getDoctorById(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    return res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
export const searchDoctors = async (req, res) => {
  try {
    // req.query chứa các thông số: ?q=Cardio&page=1&limit=10&sortBy=rating
    const result = await DoctorModel.getDoctors(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDoctorsByClinic = async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);

    const doctors = await doctorService.getDoctorsByClinic(clinicId);

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch doctors',
    });
  }
};
export const createDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.createDoctor({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      specialization: req.body.specialization,
      experience: Number(req.body.experience),
      bio: req.body.bio,
      departmentId: Number(req.body.departmentId),
    });
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.updateDoctor(req.params.id, req.body);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorsByDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const existingDept = await prisma.department.findUnique({
      where: { id: Number(id) },
    });

    if (!existingDept) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    const doctors = await prisma.doctor.findMany({
      where: { departmentId: Number(id) },
      include: { department: true },
    });

    return res.status(200).json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDoctorPatientsDashboard = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'DoctorId not found in token',
      });
    }

    const data = await DoctorModel.getDoctorPatientsWithStats(doctorId);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy dữ liệu Doctor Dashboard',
    });
  }
};

export const filterDoctorsCtrl = async (req, res) => {
  try {
    const result = await DoctorModel.getFilteredDoctors(req.query);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error('filterDoctorsCtrl error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deteleDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.deleteDoctor(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== DOCTOR PUBLIC PROFILE ==========

// Lấy profile công khai của bác sĩ
export const getDoctorPublicProfileCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorModel.getDoctorPublicProfile(id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bác sĩ',
      });
    }

    return res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Bác sĩ cập nhật profile cá nhân
export const updateMyProfileCtrl = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy doctorId',
      });
    }

    const doctor = await DoctorModel.updateDoctorProfile(doctorId, req.body);

    return res.json({
      success: true,
      message: 'Cập nhật thành công. Vui lòng chờ admin duyệt.',
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Bác sĩ xem profile của mình
export const getMyProfileCtrl = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy doctorId',
      });
    }

    const doctor = await DoctorModel.getDoctorMyProfile(doctorId);

    return res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ========== ADMIN ==========

// Admin: Lấy danh sách bác sĩ chờ duyệt
export const getPendingProfilesCtrl = async (req, res) => {
  try {
    const doctors = await DoctorModel.getPendingDoctorProfiles();

    return res.json({ success: true, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Duyệt profile bác sĩ
export const approveProfileCtrl = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const adminId = req.user.adminId;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy adminId',
      });
    }

    const doctor = await DoctorModel.approveDoctorProfile(adminId, Number(doctorId));

    return res.json({
      success: true,
      message: 'Đã duyệt profile bác sĩ',
      data: doctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
