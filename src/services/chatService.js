import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import userService from './userService';

/**
 * Service for managing chat messages in Firestore
 * Uses real-time listeners (onSnapshot) for instant messaging
 */
const chatService = {
  /**
   * Send a text message
   * @param {string} matchId - ID of the match/conversation
   * @param {string} text - Message text
   * @returns {Promise<void>}
   */
  sendMessage: async (matchId, text) => {
    const user = auth().currentUser;
    if (!user) {throw new Error('Usuario no autenticado');}

    const messageData = {
      text,
      senderId: user.uid,
      senderName: user.displayName || 'Usuario',
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'text',
    };

    // Add message to the subcollection
    await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .add(messageData);

    // Update last message in the match
    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        lastMessage: text,
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Subscribe to messages in real-time
   * @param {string} matchId - ID of the match/conversation
   * @param {function} onMessages - Callback when messages arrive
   * @returns {function} - Unsubscribe function
   */
  subscribeToMessages: (matchId, onMessages) => {
    if (!matchId) {
      onMessages([]);
      return () => {};
    }

    return firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        snapshot => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }));
          onMessages(messages);
        },
        error => {
          console.error('Error escuchando mensajes:', error);
          onMessages([]);
        }
      );
  },

  /**
   * Mark messages as read
   * @param {string} matchId - ID of the match
   * @param {string} currentUserId - ID of the current user
   * @returns {Promise<void>}
   */
  markAsRead: async (matchId, currentUserId) => {
    if (!matchId || !currentUserId) {return;}

    try {
      const unreadMessages = await firestore()
        .collection('messages')
        .doc(matchId)
        .collection('chat')
        .where('senderId', '!=', currentUserId)
        .where('read', '==', false)
        .get();

      if (unreadMessages.empty) {return;}

      const batch = firestore().batch();
      unreadMessages.docs.forEach(doc => {
        batch.update(doc.ref, {read: true});
      });
      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  /**
   * Subscribe to conversations in real-time
   * @param {string} userId - ID of the current user
   * @param {function} onConversations - Callback with conversations
   * @returns {function} - Unsubscribe function
   */
  subscribeToConversations: (userId, onConversations) => {
    if (!userId) {
      onConversations([]);
      return () => {};
    }

    return firestore()
      .collection('matches')
      .where('users', 'array-contains', userId)
      .where('isActive', '==', true)
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(
        async snapshot => {
          try {
            const conversations = await Promise.all(
              snapshot.docs.map(async doc => {
                const matchData = doc.data();
                const otherUserId = matchData.users.find(id => id !== userId);

                // Get other user's data
                const otherUser = await userService.getUser(otherUserId);

                // Get unread count
                const unreadCount = await chatService.getUnreadCount(doc.id, userId);

                return {
                  id: doc.id,
                  ...matchData,
                  otherUser,
                  unreadCount,
                  lastMessageAt: matchData.lastMessageAt?.toDate?.() || new Date(),
                };
              })
            );
            onConversations(conversations);
          } catch (error) {
            console.error('Error processing conversations:', error);
            onConversations([]);
          }
        },
        error => {
          console.error('Error escuchando conversaciones:', error);
          onConversations([]);
        }
      );
  },

  /**
   * Get unread message count
   * @param {string} matchId - ID of the match
   * @param {string} currentUserId - ID of the current user
   * @returns {Promise<number>}
   */
  getUnreadCount: async (matchId, currentUserId) => {
    if (!matchId || !currentUserId) {return 0;}

    try {
      const snapshot = await firestore()
        .collection('messages')
        .doc(matchId)
        .collection('chat')
        .where('senderId', '!=', currentUserId)
        .where('read', '==', false)
        .get();

      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  /**
   * Send an image message (base64)
   * @param {string} matchId - ID of the match
   * @param {string} imageBase64 - Image in base64 format
   * @returns {Promise<void>}
   */
  sendImage: async (matchId, imageBase64) => {
    const user = auth().currentUser;
    if (!user) {throw new Error('Usuario no autenticado');}

    const messageData = {
      text: '',
      image: imageBase64,
      senderId: user.uid,
      senderName: user.displayName || 'Usuario',
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'image',
    };

    await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .add(messageData);

    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        lastMessage: '📷 Imagen',
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Set typing status
   * @param {string} matchId - ID of the match
   * @param {boolean} isTyping - Whether the user is typing
   * @returns {Promise<void>}
   */
  setTypingStatus: async (matchId, isTyping) => {
    const user = auth().currentUser;
    if (!user || !matchId) {return;}

    try {
      await firestore()
        .collection('matches')
        .doc(matchId)
        .update({
          [`typing.${user.uid}`]: isTyping,
        });
    } catch (error) {
      // Ignore errors for typing status
      console.log('Error setting typing status:', error.message);
    }
  },

  /**
   * Subscribe to typing status
   * @param {string} matchId - ID of the match
   * @param {string} currentUserId - ID of the current user
   * @param {function} onTyping - Callback when typing status changes
   * @returns {function} - Unsubscribe function
   */
  subscribeToTyping: (matchId, currentUserId, onTyping) => {
    if (!matchId || !currentUserId) {
      onTyping(false);
      return () => {};
    }

    return firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(
        snapshot => {
          const data = snapshot.data();
          if (data?.typing) {
            const otherUserTyping = Object.entries(data.typing)
              .filter(([id, typing]) => id !== currentUserId && typing)
              .length > 0;
            onTyping(otherUserTyping);
          } else {
            onTyping(false);
          }
        },
        error => {
          console.error('Error subscribing to typing:', error);
          onTyping(false);
        }
      );
  },

  /**
   * Get all messages for a conversation (non-realtime)
   * @param {string} matchId - ID of the match
   * @param {number} limit - Maximum messages to fetch
   * @returns {Promise<Array>}
   */
  getMessages: async (matchId, limit = 50) => {
    if (!matchId) {return [];}

    try {
      const snapshot = await firestore()
        .collection('messages')
        .doc(matchId)
        .collection('chat')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },
};

export default chatService;
