import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const onlineUsers = new Map(); // Map<socketId, { userId, role }>

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware xác thực socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        socket.userId = decoded.userId;
        socket.role = decoded.roleName;
        socket.patientId = decoded.patientId;
        socket.doctorId = decoded.doctorId;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    } else {
      next(new Error('No token provided'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.role})`);

    // Lưu user online
    onlineUsers.set(socket.userId, {
      socketId: socket.id,
      role: socket.role,
      patientId: socket.patientId,
      doctorId: socket.doctorId,
    });

    // Gửi danh sách user online cho client
    socket.emit('online-users', Array.from(onlineUsers.keys()));

    // Join room theo userId để nhận tin nhắn riêng
    socket.join(`user:${socket.userId}`);

    // Join room theo role
    if (socket.role) {
      socket.join(`role:${socket.role}`);
    }

    // Gửi tin nhắn mới
    socket.on('send-message', async (data) => {
      const { receiverId, content, receiverType } = data;

      // Emit cho người nhận nếu online
      io.to(`user:${receiverId}`).emit('new-message', {
        senderId: socket.userId,
        senderType: socket.role,
        content,
        timestamp: new Date(),
      });

      // Emit cho sender để xác nhận
      socket.emit('message-sent', {
        receiverId,
        content,
        timestamp: new Date(),
      });
    });

    // Khi nhận tin nhắn mới từ server (sau khi lưu DB)
    socket.on('message-created', (data) => {
      io.to(`user:${data.receiverId}`).emit('new-message', data);
      io.to(`user:${data.senderId}`).emit('new-message', data);
    });

    // Typing indicator
    socket.on('typing', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('user-typing', {
        userId: socket.userId,
        typing: true,
      });
    });

    socket.on('stop-typing', ({ receiverId }) => {
      io.to(`user:${receiverId}`).emit('user-typing', {
        userId: socket.userId,
        typing: false,
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      onlineUsers.delete(socket.userId);
      io.emit('online-users', Array.from(onlineUsers.keys()));
    });
  });

  return io;
}

export { onlineUsers };
