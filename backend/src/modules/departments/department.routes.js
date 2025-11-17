import express from 'express';
import * as DepartmentController from '../departments/department.controller.js';

const router = express.Router();

router.get('/', DepartmentController.getAllDepartment);
router.post('/', DepartmentController.createDepartment);
router.put('/:id', DepartmentController.updateDepartment);
router.delete('/:id', DepartmentController.deleteDepartment);
export default router;
