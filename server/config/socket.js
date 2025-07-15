const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');

const configureSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket.io middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
      
      // Find user
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      if (!user.isActive) {
        return next(new Error('Authentication error: User inactive'));
      }
      
      // Attach user to socket
      socket.user = {
        id: user._id,
        role: user.role,
        tenantId: user.tenantId
      };
      
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Join user's room
    socket.join(socket.user.id.toString());
    
    // Join tenant room
    socket.join(`tenant:${socket.user.tenantId}`);
    
    // Join role room
    socket.join(`role:${socket.user.role}`);
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
    
    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.id}:`, error);
    });
  });

  return io;
};

module.exports = configureSocket;