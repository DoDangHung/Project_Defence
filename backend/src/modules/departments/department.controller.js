import prisma from '../../config/db.js';
import * as DepartmentModel from '../departments/department.service.js';

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
    const { name, description, doctorIds } = req.body;
    const departments = await DepartmentModel.createDepartment({
      name,
      description,
    });
    if (doctorIds && doctorIds.length > 0) {
      await prisma.doctor.updateMany({
        where: {
          id: { in: doctorIds.map(Number) },
          data: {
            departmentId: departments.id,
          },
        },
      });
    }
    const fullDepart = await prisma.department.findUnique({
      where: { id: departments.id },
      include: { doctors: true },
    });
    res.status(200).json({ success: true, data: fullDepart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, doctorIds } = req.body;
    const existingDept = await prisma.department.findUnique({
      where: { id: Number(id) },
    });
    if (!existingDept) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
      });
    }
    // 1. Update info of department
    await prisma.department.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    // 2. Remove all doctors from this department
    await prisma.doctor.updateMany({
      where: { departmentId: Number(id) },
      data: { departmentId: { set: null } },
    });

    // 3. Assign new doctor list
    if (doctorIds && doctorIds.length > 0) {
      await prisma.doctor.updateMany({
        where: {
          id: { in: doctorIds.map(Number) },
        },
        data: { departmentId: Number(id) },
      });
    }

    // 4. Get updated department including doctors
    const updatedDepart = await prisma.department.findUnique({
      where: { id: Number(id) },
      include: { doctors: true },
    });
    res.status(200).json({ success: true, data: updatedDepart });
  } catch (err) {
    console.log('❌ Error updating department:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.doctor.updateMany({
      where: { departmentId: Number(id) },
      data: { departmentId: { set: null } },
    });
    const deletedDepart = await DepartmentModel.deleteDepartment(id);
    return res.status(200).json({ success: true, data: deletedDepart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
