/**
 * Example Socket.IO Backend Server for CrushUV Chat
 * 
 * This is a simple example server for testing the real-time chat functionality.
 * In production, you would integrate this with your existing backend.
 * 
 * Installation:
 * npm install express socket.io cors
 * 
 * Usage:
 * node example-server.js
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // In production, specify your app's URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Store connected users (in production, use a database)
const connectedUsers = new Map();
const conversations = new Map();

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connectedUsers: connectedUsers.size,
    uptime: process.uptime(),
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('🔗 New user connected:', socket.id);
  
  // Extract user ID from auth (in production, verify JWT token)
  const userId = socket.handshake.auth.userId;
  
  if (userId) {
    connectedUsers.set(userId, {
      socketId: socket.id,
      online: true,
      connectedAt: new Date(),
    });
    
    // Notify others that this user is online
    socket.broadcast.emit('user_status_change', {
      userId: userId,
      online: true,
    });
    
    console.log('👤 User authenticated:', userId);
  }
  
  // User joins a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`📥 User ${userId} joined conversation: ${conversationId}`);
    
    // Send conversation history if available (in production, fetch from DB)
    if (conversations.has(conversationId)) {
      socket.emit('conversation_history', {
        conversationId,
        messages: conversations.get(conversationId),
      });
    }
  });
  
  // User leaves a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`📤 User ${userId} left conversation: ${conversationId}`);
  });
  
  // Handle incoming messages
  socket.on('send_message', (messageData) => {
    console.log('💬 Message received:', messageData);
    
    const {conversationId, text, senderId, recipientId, timestamp} = messageData;
    
    // Save message to conversation history (in production, save to database)
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, []);
    }
    
    const message = {
      id: Date.now(),
      conversationId,
      text,
      senderId,
      recipientId,
      timestamp: timestamp || new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: new Date(),
    };
    
    conversations.get(conversationId).push(message);
    
    // Broadcast message to all users in the conversation room
    io.to(conversationId).emit('new_message', message);
    
    console.log(`✅ Message sent to conversation: ${conversationId}`);
  });
  
  // Handle typing indicator
  socket.on('typing', ({conversationId, isTyping}) => {
    // Broadcast typing status to others in the conversation
    socket.to(conversationId).emit('user_typing', {
      conversationId,
      userId,
      isTyping,
    });
    
    console.log(`⌨️  User ${userId} is ${isTyping ? 'typing' : 'stopped typing'} in ${conversationId}`);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
    
    if (userId) {
      connectedUsers.delete(userId);
      
      // Notify others that this user is offline
      socket.broadcast.emit('user_status_change', {
        userId: userId,
        online: false,
      });
      
      console.log('👋 User signed off:', userId);
    }
  });
  
  // Handle errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 CrushUV Chat Server is running!                      ║
║                                                            ║
║   📡 WebSocket Server: http://localhost:${PORT}              ║
║   🏥 Health Check: http://localhost:${PORT}/health          ║
║                                                            ║
║   💡 Waiting for connections...                           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
