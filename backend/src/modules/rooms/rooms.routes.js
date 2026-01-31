import { Router } from 'express';
import { authenticateToken } from '../../middlewares/auth.middleware.js';
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
} from './rooms.controller.js';
const router = Router();

// Optional: Only admin can modify rooms
router.post('/', authenticateToken, createRoom);
router.get('/', authenticateToken, getAllRooms);
router.get('/:id', authenticateToken, getRoomById);
router.put('/:id', authenticateToken, updateRoom);
router.delete('/:id', authenticateToken, deleteRoom);

export default router;
