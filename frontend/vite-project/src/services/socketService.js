import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8080';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Lắng nghe tin nhắn mới - dùng once để tránh duplicate listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.off('new-message'); // Remove old listeners first
      this.socket.on('new-message', (message) => {
        callback(message);
      });
    }
  }

  // Lắng nghe tin nhắn đã gửi thành công
  onMessageSent(callback) {
    if (this.socket) {
      this.socket.off('message-sent'); // Remove old listeners first
      this.socket.on('message-sent', (message) => {
        callback(message);
      });
    }
  }

  // Lắng nghe typing
  onTyping(callback) {
    if (this.socket) {
      this.socket.off('user-typing'); // Remove old listeners first
      this.socket.on('user-typing', (data) => {
        callback(data);
      });
    }
  }

  // Lắng nghe user online
  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.off('online-users'); // Remove old listeners first
      this.socket.on('online-users', (users) => {
        callback(users);
      });
    }
  }

  // Gửi typing
  sendTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing', { receiverId });
    }
  }

  // Gửi stop typing
  sendStopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('stop-typing', { receiverId });
    }
  }

  // Remove listener
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export const socketService = new SocketService();
