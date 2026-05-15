import express from 'express';
import { messageController } from './message.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Gửi tin nhắn
router.post('/', messageController.sendMessage);

// Lấy danh sách cuộc trò chuyện (inbox)
router.get('/conversations', messageController.getConversations);

// Lấy cuộc trò chuyện với người cụ thể
router.get('/conversation/:otherUserId', messageController.getConversation);

// Lấy số tin nhắn chưa đọc
router.get('/unread', messageController.getUnreadCount);

// Đánh dấu đã đọc
router.put('/:messageId/read', messageController.markAsRead);

// Xóa tin nhắn
router.delete('/:messageId', messageController.deleteMessage);

export default router;
