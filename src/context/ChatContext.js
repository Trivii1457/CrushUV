import React, {createContext, useState, useEffect, useContext, useCallback} from 'react';

// Firebase imports (optional - app works in demo mode without them)
let firestore = null;
let auth = null;
try {
  firestore = require('@react-native-firebase/firestore').default;
  auth = require('@react-native-firebase/auth').default;
} catch (e) {
  console.log('Firebase not available, using demo mode');
}

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [isConnected, setIsConnected] = useState(true); // Demo mode always connected
  const [currentUserId, setCurrentUserId] = useState('user_123');
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [useFirebase, setUseFirebase] = useState(false);

  // Initialize
  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    // Try Firebase auth
    if (auth) {
      const user = auth().currentUser;
      if (user) {
        setCurrentUserId(user.uid);
        setUseFirebase(true);
        setIsConnected(true);
        console.log('Using Firebase with user:', user.uid);
        return;
      }
    }
    
    // Fall back to demo mode
    console.log('Using demo mode');
    setIsConnected(true);
    initializeSampleData();
  };

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
  const sendMessage = async (conversationId, text, recipientId) => {
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

    // If using Firebase, also save to Firestore
    if (useFirebase && firestore) {
      try {
        await firestore()
          .collection('conversations')
          .doc(conversationId)
          .collection('messages')
          .add({
            text,
            senderId: currentUserId,
            receiverId: recipientId,
            timestamp: firestore.FieldValue.serverTimestamp(),
            read: false,
          });
      } catch (error) {
        console.error('Error sending message to Firebase:', error);
      }
    }
  };

  /**
   * Join a conversation
   */
  const joinConversation = (conversationId) => {
    console.log('Joined conversation:', conversationId);
  };

  /**
   * Leave a conversation
   */
  const leaveConversation = (conversationId) => {
    console.log('Left conversation:', conversationId);
  };

  /**
   * Send typing status
   */
  const setTypingStatus = (conversationId, isTyping) => {
    // In demo mode, just log
    console.log('Typing status:', conversationId, isTyping);
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
