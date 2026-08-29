const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const notificationService = require('../services/notification.service');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling']
  });

  // Auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.userId}`);
    socket.join(`user:${socket.userId}`);

    socket.on('join:booking', (bookingId) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on('leave:booking', (bookingId) => {
      socket.leave(`booking:${bookingId}`);
    });

    socket.on('message:send', async (data) => {
      try {
        const { bookingId, text, imageUrl, receiverId } = data;
        const msg = await Message.create({
          bookingId, text, imageUrl,
          senderId: socket.userId,
          receiverId,
          messageType: imageUrl ? 'image' : 'text'
        });
        const populated = await msg.populate('senderId', 'fullName avatarUrl');
        io.to(`booking:${bookingId}`).emit('message:new', populated);

        // Push notification to receiver
        const User = require('../models/User');
        const receiver = await User.findById(receiverId).select('fcmToken');
        if (receiver?.fcmToken) {
          await notificationService.sendPush(
            receiver.fcmToken,
            'New Message',
            text || 'Sent an image',
            { type: 'chat_new', bookingId }
          );
        }
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('typing:start', ({ bookingId }) => {
      socket.to(`booking:${bookingId}`).emit('typing:start', { userId: socket.userId });
    });

    socket.on('typing:stop', ({ bookingId }) => {
      socket.to(`booking:${bookingId}`).emit('typing:stop', { userId: socket.userId });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });

  return io;
};

module.exports = { initSocket };
