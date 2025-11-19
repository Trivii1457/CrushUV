import React, {createContext, useState, useEffect, useContext} from 'react';
import socketService from '../services/socketService';

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('user_123'); // Simulated user ID
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});

  // Initialize socket connection
  useEffect(() => {
    // Connect to socket server
    socketService.connect(currentUserId);

    // Listen for new messages
    socketService.onNewMessage(handleNewMessage);

    // Listen for typing status
    socketService.onTyping(handleTyping);

    // Listen for user status changes
    socketService.onUserStatusChange(handleUserStatusChange);

    // Update connection status
    const checkConnection = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Initialize with sample conversations for demo purposes
    initializeSampleData();

    return () => {
      clearInterval(checkConnection);
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  /**
   * Initialize sample data for demo purposes
   * In production, this would be fetched from backend
   */
  const initializeSampleData = () => {
    const sampleConversations = [
      {
        id: 'conv_1',
        matchId: 1,
        name: 'Ana María',
        photo: 'https://via.placeholder.com/60/FF6B6B/FFFFFF?text=A',
        lastMessage: '¡Hola! ¿Cómo estás?',
        timestamp: '2m',
        unread: 0,
        online: true,
      },
      {
        id: 'conv_2',
        matchId: 2,
        name: 'Carlos',
        photo: 'https://via.placeholder.com/60/4ECDC4/FFFFFF?text=C',
        lastMessage: 'Nos vemos mañana en la U',
        timestamp: '1h',
        unread: 0,
        online: false,
      },
      {
        id: 'conv_3',
        matchId: 3,
        name: 'Sofía',
        photo: 'https://via.placeholder.com/60/95E1D3/FFFFFF?text=S',
        lastMessage: '😊',
        timestamp: '3h',
        unread: 0,
        online: true,
      },
    ];

    const sampleMessages = {
      conv_1: [
        {
          id: 1,
          text: '¡Hola! Vi que también estudias en Univalle 😊',
          sender: 'them',
          timestamp: '10:30',
          senderId: 1,
        },
        {
          id: 2,
          text: '¡Hola! Sí, estoy en tercer semestre',
          sender: 'me',
          timestamp: '10:32',
          senderId: currentUserId,
        },
        {
          id: 3,
          text: '¿Qué estudias?',
          sender: 'them',
          timestamp: '10:33',
          senderId: 1,
        },
        {
          id: 4,
          text: 'Ingeniería de Sistemas, ¿y tú?',
          sender: 'me',
          timestamp: '10:35',
          senderId: currentUserId,
        },
      ],
    };

    setConversations(sampleConversations);
    setMessages(sampleMessages);
    
    // Set initial online status
    const initialOnlineUsers = {};
    sampleConversations.forEach(conv => {
      initialOnlineUsers[conv.matchId] = conv.online;
    });
    setOnlineUsers(initialOnlineUsers);
  };

  /**
   * Handle new incoming message
   */
  const handleNewMessage = (message) => {
    const {conversationId, text, senderId, timestamp} = message;

    // Add message to the conversation
    setMessages((prevMessages) => {
      const conversationMessages = prevMessages[conversationId] || [];
      const newMessage = {
        id: Date.now(),
        text,
        sender: senderId === currentUserId ? 'me' : 'them',
        timestamp: timestamp || new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        senderId,
      };
      return {
        ...prevMessages,
        [conversationId]: [...conversationMessages, newMessage],
      };
    });

    // Update last message in conversation list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: text,
              timestamp: 'Ahora',
              unread: senderId !== currentUserId ? conv.unread + 1 : conv.unread,
            }
          : conv,
      ),
    );
  };

  /**
   * Handle typing status
   */
  const handleTyping = ({conversationId, userId, isTyping}) => {
    setTypingUsers((prev) => ({
      ...prev,
      [conversationId]: isTyping ? userId : null,
    }));
  };

  /**
   * Handle user status changes
   */
  const handleUserStatusChange = ({userId, online}) => {
    setOnlineUsers((prev) => ({
      ...prev,
      [userId]: online,
    }));

    // Update conversation list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.matchId === userId ? {...conv, online} : conv,
      ),
    );
  };

  /**
   * Send a message
   */
  const sendMessage = (conversationId, text, recipientId) => {
    const timestamp = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageData = {
      conversationId,
      text,
      senderId: currentUserId,
      recipientId,
      timestamp,
    };

    // Optimistically add message to local state
    handleNewMessage(messageData);

    // Send message through socket
    socketService.sendMessage(messageData);
  };

  /**
   * Join a conversation
   */
  const joinConversation = (conversationId) => {
    socketService.joinConversation(conversationId);
  };

  /**
   * Leave a conversation
   */
  const leaveConversation = (conversationId) => {
    socketService.leaveConversation(conversationId);
  };

  /**
   * Send typing status
   */
  const setTypingStatus = (conversationId, isTyping) => {
    socketService.sendTypingStatus(conversationId, isTyping);
  };

  /**
   * Mark conversation as read
   */
  const markConversationAsRead = (conversationId) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId ? {...conv, unread: 0} : conv,
      ),
    );
  };

  /**
   * Get messages for a conversation
   */
  const getConversationMessages = (conversationId) => {
    return messages[conversationId] || [];
  };

  const value = {
    conversations,
    messages,
    isConnected,
    currentUserId,
    typingUsers,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    setTypingStatus,
    markConversationAsRead,
    getConversationMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
