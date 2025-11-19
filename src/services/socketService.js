import io from 'socket.io-client';

// Configuration for the WebSocket server
// In production, replace this with your actual backend URL
const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  /**
   * Initialize socket connection
   * @param {string} userId - The user's unique identifier
   */
  connect(userId) {
    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return;
    }

    // Create socket connection with authentication
    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        userId: userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.connected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      console.log('Socket disconnected manually');
    }
  }

  /**
   * Send a message to a specific conversation
   * @param {Object} messageData - Message data to send
   */
  sendMessage(messageData) {
    if (this.socket && this.connected) {
      this.socket.emit('send_message', messageData);
    } else {
      console.error('Socket not connected');
    }
  }

  /**
   * Join a conversation room
   * @param {string} conversationId - The conversation ID to join
   */
  joinConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('join_conversation', conversationId);
      console.log('Joined conversation:', conversationId);
    }
  }

  /**
   * Leave a conversation room
   * @param {string} conversationId - The conversation ID to leave
   */
  leaveConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_conversation', conversationId);
      console.log('Left conversation:', conversationId);
    }
  }

  /**
   * Listen for new messages
   * @param {Function} callback - Callback function to handle new messages
   */
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  /**
   * Listen for typing indicator
   * @param {Function} callback - Callback function to handle typing events
   */
  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  /**
   * Send typing indicator
   * @param {string} conversationId - The conversation ID
   * @param {boolean} isTyping - Whether user is typing
   */
  sendTypingStatus(conversationId, isTyping) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', {conversationId, isTyping});
    }
  }

  /**
   * Listen for online status changes
   * @param {Function} callback - Callback function to handle status changes
   */
  onUserStatusChange(callback) {
    if (this.socket) {
      this.socket.on('user_status_change', callback);
    }
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.connected;
  }
}

// Export a singleton instance
export default new SocketService();
