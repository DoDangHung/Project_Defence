import { roomService } from './rooms.service.js';

export const createRoom = async (req, res) => {
  try {
    const result = await roomService.createRoom(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: result,
    });
  } catch (error) {
    console.error('Create room failed:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create room',
    });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch rooms',
    });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    res.status(200).json({
      success: true,
      data: room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch room',
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update room',
    });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete room',
    });
  }
};
