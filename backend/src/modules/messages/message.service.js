import prisma from '../../config/db.js';

export const messageService = {
  // Gửi tin nhắn
  sendMessage: async (data) => {
    const { senderId, senderType, receiverId, receiverType, content, type = 'text', attachmentUrl, attachmentName, appointmentId } = data;

    // Validate receiver exists
    if (receiverId) {
      const receiverExists = await prisma.user.findUnique({ where: { id: receiverId } });
      if (!receiverExists) {
        throw new Error(`Receiver with ID ${receiverId} does not exist`);
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId,
        senderType,
        receiverId,
        receiverType,
        content,
        type,
        attachmentUrl,
        attachmentName,
        appointmentId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Tạo notification cho người nhận
    if (receiverId) {
      await prisma.notification.create({
        data: {
          userId: receiverId,
          userType: receiverType,
          type: 'message',
          title: 'Tin nhắn mới',
          message: `${message.sender.firstName} ${message.sender.lastName}: ${content.substring(0, 50)}...`,
          link: '/messages',
        },
      });
    }

    return message;
  },

  // Lấy cuộc trò chuyện giữa 2 người
  getConversation: async (userId, otherUserId, page = 1, limit = 50) => {
    const skip = (page - 1) * limit;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    // Đánh dấu đã đọc
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return messages.reverse();
  },

  // Lấy danh sách cuộc trò chuyện (inbox)
  getConversations: async (userId, userType) => {
    // Lấy tất cả tin nhắn liên quan đến user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Nhóm theo cuộc trò chuyện
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!otherUserId || !otherUser || !conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userType: msg.senderId === userId ? msg.receiverType : msg.senderType,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      // Đếm tin nhắn chưa đọc
      if (msg.receiverId === userId && !msg.isRead) {
        const conv = conversationsMap.get(otherUserId);
        conv.unreadCount = (conv.unreadCount || 0) + 1;
      }
    }

    return Array.from(conversationsMap.values());
  },

  // Lấy tin nhắn với bác sĩ cụ thể
  getDoctorConversations: async (doctorId) => {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: doctorId, senderType: 'doctor' },
          { receiverId: doctorId, receiverType: 'doctor' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            patient: {
              include: { user: true },
            },
            doctor: {
              include: { user: true },
            },
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            patient: {
              include: { user: true },
            },
            doctor: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Nhóm theo cuộc trò chuyện
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.senderId === doctorId ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderId === doctorId ? msg.receiver : msg.sender;
      const otherUserType = msg.senderId === doctorId ? msg.receiverType : msg.senderType;

      if (!otherUserId || !otherUser || !conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userType: otherUserType,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      if (msg.receiverId === doctorId && !msg.isRead) {
        const conv = conversationsMap.get(otherUserId);
        conv.unreadCount = (conv.unreadCount || 0) + 1;
      }
    }

    return Array.from(conversationsMap.values());
  },

  // Lấy tin nhắn với admin
  getAdminConversations: async () => {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderType: 'admin' },
          { receiverType: 'admin' },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            patient: { include: { user: true } },
            doctor: { include: { user: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Nhóm theo cuộc trò chuyện
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.senderType === 'admin' ? msg.receiverId : msg.senderId;
      const otherUser = msg.senderType === 'admin' ? msg.receiver : msg.sender;
      const otherUserType = msg.senderType === 'admin' ? msg.receiverType : msg.senderType;

      if (!otherUserId || !otherUser || !conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userType: otherUserType,
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      if (msg.receiverType === 'admin' && !msg.isRead) {
        const conv = conversationsMap.get(otherUserId);
        conv.unreadCount = (conv.unreadCount || 0) + 1;
      }
    }

    return Array.from(conversationsMap.values());
  },

  // Đếm tin nhắn chưa đọc
  getUnreadCount: async (userId) => {
    const count = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
    return count;
  },

  // Đánh dấu đã đọc
  markAsRead: async (messageId, userId) => {
    return prisma.message.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  // Xóa tin nhắn
  deleteMessage: async (messageId, userId) => {
    const message = await prisma.message.findUnique({ where: { id: messageId } });

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId !== userId) {
      throw new Error('You can only delete your own messages');
    }

    return prisma.message.delete({ where: { id: messageId } });
  },
};
