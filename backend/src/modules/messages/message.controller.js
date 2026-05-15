import { messageService } from './message.service.js';

export const messageController = {
  // Gửi tin nhắn
  sendMessage: async (req, res) => {
    try {
      const senderId = req.user.userId;
      const senderType = req.user.roleName; // patient, doctor, admin

      const { receiverId, receiverType, content, type, attachmentUrl, attachmentName, appointmentId } = req.body;

      if (!receiverId || !receiverType || !content) {
        return res.status(400).json({
          success: false,
          message: 'receiverId, receiverType, và content là bắt buộc',
        });
      }
      console.log('[sendMessage] senderId:', senderId, 'receiverId:', receiverId, 'receiverType:', receiverType);

      const message = await messageService.sendMessage({
        senderId,
        senderType,
        receiverId,
        receiverType,
        content,
        type,
        attachmentUrl,
        attachmentName,
        appointmentId,
      });

      // Emit socket event cho real-time
      const io = req.app.get('io');
      if (io) {
        io.to(`user:${receiverId}`).emit('new-message', message);
        io.to(`user:${senderId}`).emit('message-sent', message);
      }

      return res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error('Send message error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to send message',
      });
    }
  },

  // Lấy cuộc trò chuyện
  getConversation: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { otherUserId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const messages = await messageService.getConversation(
        userId,
        parseInt(otherUserId),
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error('Get conversation error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get conversation',
      });
    }
  },

  // Lấy danh sách cuộc trò chuyện (inbox)
  getConversations: async (req, res) => {
    try {
      const userId = req.user.userId;
      const userType = req.user.roleName;
      console.log('[getConversations] userId:', userId, 'userType:', userType);

      const conversations = await messageService.getConversations(userId, userType);
      console.log('[getConversations] returning', conversations.length, 'conversations');

      return res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('Get conversations error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get conversations',
      });
    }
  },

  // Lấy cuộc trò chuyện của bác sĩ
  getDoctorConversations: async (req, res) => {
    try {
      const doctorId = req.user.doctorId;

      const conversations = await messageService.getDoctorConversations(doctorId);

      return res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('Get doctor conversations error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get conversations',
      });
    }
  },

  // Lấy cuộc trò chuyện của admin
  getAdminConversations: async (req, res) => {
    try {
      const conversations = await messageService.getAdminConversations();

      return res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('Get admin conversations error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get conversations',
      });
    }
  },

  // Lấy số tin nhắn chưa đọc
  getUnreadCount: async (req, res) => {
    try {
      const userId = req.user.userId;
      const count = await messageService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        data: { unreadCount: count },
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to get unread count',
      });
    }
  },

  // Đánh dấu đã đọc
  markAsRead: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;

      await messageService.markAsRead(parseInt(messageId), userId);

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error('Mark as read error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark as read',
      });
    }
  },

  // Xóa tin nhắn
  deleteMessage: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { messageId } = req.params;

      await messageService.deleteMessage(parseInt(messageId), userId);

      return res.status(200).json({
        success: true,
        message: 'Tin nhắn đã được xóa',
      });
    } catch (error) {
      console.error('Delete message error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete message',
      });
    }
  },
};
