import app from './app.js';
import { createServer } from 'http';
import { initSocket } from './config/socket.js';

const PORT = process.env.PORT || 8080;

// Tạo HTTP server
const httpServer = createServer(app);

// Khởi tạo Socket.io
const io = initSocket(httpServer);

// Lưu io vào app để có thể access từ controllers
app.set('io', io);

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io initialized`);
});
