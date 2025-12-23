import express from 'express';
import * as UserController from '../controllers/user.controller.js';
import { uploadAvatar } from '../middlewares/upload.js';
import { uploadUserAvatar } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUsersById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

router.post('/:id/avatar', uploadAvatar.single('avatar'), uploadUserAvatar);
export default router;
