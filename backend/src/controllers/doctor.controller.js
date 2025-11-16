import * as DoctorModel from '../models/doctor.model.js';
import prisma from '../config/db.js';

export const getAllDoctor = async (req, res) => {
  try {
    const doctors = await DoctorModel.getAllDoctor(req.query.departmentId);
    res.json({ success: true, data: doctors });
    console.log(doctors);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getDoctor = async (req, res) => {
//   try {
//     const { departmentId } = req.query;
//     const doctors = await DoctorModel.getAllDoctor(departmentId);
//     res.json({ success: true, data: doctors });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

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

export const searchDoctorsCtrl = async (req, res) => {
  try {
    const {
      q,
      departmentId,
      specialization,
      minExperience,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      order = 'desc',
    } = req.query;
    console.log('hit deparment name: ', req.query);
    const result = await DoctorModel.searchDoctors({
      q,
      departmentId,
      specialization,
      minExperience,
      minRating,
      page,
      limit,
      sortBy,
      order,
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error('searchDoctorsCtrl error:', err);
    return res.status(500).json({ success: false, message: err.message });
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
