import express from 'express';
import * as DepartmentController from '../controllers/department.controller.js';

const router = express.Router();

router.get('/', DepartmentController.getAllDepartment);
router.post('/', DepartmentController.createDepartment);
router.delete('/:id', DepartmentController.deleteDepartment);
export default router;
