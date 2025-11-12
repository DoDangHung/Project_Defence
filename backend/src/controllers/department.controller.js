import * as DepartmentModel from '../models/department.model.js';

export const getAllDepartment = async (req, res) => {
  try {
    const departments = await DepartmentModel.getAllDepartment(
      req.query.doctorId
    );
    res.json({ success: true, data: departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const departments = await DepartmentModel.createDepartment({
      name: req.body.name,
      description: req.body.description,
    });
    res.status(200).json({ success: true, data: departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
