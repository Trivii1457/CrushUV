// Socket.IO disabled - using Firebase instead
// import io from 'socket.io-client';

// Configuration for the WebSocket server
// In production, replace this with your actual backend URL
const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    // Disabled: Auto-connection removed - using Firebase instead
  }

  /**
   * Initialize socket connection
   * @param {string} userId - The user's unique identifier
   */
  connect(userId) {
    // Disabled: Using Firebase instead
    console.log('Socket disabled - using Firebase for real-time messaging');
    return;
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    // Disabled
    console.log('Socket disconnected manually');
  }

  /**
   * Send a message to a specific conversation
   * @param {Object} messageData - Message data to send
   */
  sendMessage(messageData) {
    // Disabled - using Firebase
    console.log('Message sent via Firebase');
  }

  /**
   * Join a conversation room
   * @param {string} conversationId - The conversation ID to join
   */
  joinConversation(conversationId) {
    // Disabled - using Firebase
    console.log('Joined conversation:', conversationId);
  }

  /**
   * Leave a conversation room
   * @param {string} conversationId - The conversation ID to leave
   */
  leaveConversation(conversationId) {
    // Disabled - using Firebase
    console.log('Left conversation:', conversationId);
  }

  /**
   * Listen for new messages
   * @param {Function} callback - Callback function to handle new messages
   */
  onNewMessage(callback) {
    // Disabled - using Firebase
  }

  /**
   * Listen for typing indicator
   * @param {Function} callback - Callback function to handle typing events
   */
  onTyping(callback) {
    // Disabled - using Firebase
  }

  /**
   * Send typing indicator
   * @param {string} conversationId - The conversation ID
   * @param {boolean} isTyping - Whether user is typing
   */
  sendTypingStatus(conversationId, isTyping) {
    // Disabled - using Firebase
  }

  /**
   * Listen for online status changes
   * @param {Function} callback - Callback function to handle status changes
   */
  onUserStatusChange(callback) {
    // Disabled - using Firebase
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners() {
    // Disabled - using Firebase
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
