import * as DoctorModel from '../models/doctor.model.js';
import prisma from '../config/db.js';

export const getAllDoctor = async (req, res) => {
  try {
    const doctors = await DoctorModel.getAllDoctor();
    res.json({ success: true, data: doctors });
    console.log(doctors);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctors = await DoctorModel.getDoctorById(req.params.id);
    if (!doctors)
      return res
        .status(404)
        .json({ success: false, message: 'Dotor not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.createDoctor(req.body);
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

export const deteleDoctor = async (req, res) => {
  try {
    const doctor = await DoctorModel.deleteDoctor(req.params.id);
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
