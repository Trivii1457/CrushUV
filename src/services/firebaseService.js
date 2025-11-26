import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class FirebaseService {
  constructor() {
    this.currentUser = null;
    this.unsubscribers = [];
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Sign in anonymously (for testing) or with email/password
   */
  async signInAnonymously() {
    try {
      const userCredential = await auth().signInAnonymously();
      this.currentUser = userCredential.user;
      console.log('Signed in anonymously:', this.currentUser.uid);
      return this.currentUser;
    } catch (error) {
      console.error('Anonymous sign in error:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email, password) {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      return this.currentUser;
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  }

  /**
   * Register with email and password
   */
  async registerWithEmail(email, password) {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      return this.currentUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  async signOut() {
    try {
      await auth().signOut();
      this.currentUser = null;
      this.unsubscribeAll();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  /**
   * Send a message to a conversation
   */
  async sendMessage(conversationId, text, senderId, receiverId) {
    try {
      const message = {
        text,
        senderId,
        receiverId,
        timestamp: firestore.FieldValue.serverTimestamp(),
        read: false,
      };

      // Add message to messages subcollection
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(message);

      // Update conversation with last message
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .set({
          lastMessage: text,
          lastMessageTime: firestore.FieldValue.serverTimestamp(),
          participants: [senderId, receiverId],
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Listen for new messages in a conversation
   */
  subscribeToMessages(conversationId, callback) {
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        snapshot => {
          const messages = [];
          snapshot.forEach(doc => {
            messages.push({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate?.() || new Date(),
            });
          });
          callback(messages);
        },
        error => {
          console.error('Error listening to messages:', error);
        }
      );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Listen for all conversations of a user
   */
  subscribeToConversations(userId, callback) {
    const unsubscribe = firestore()
      .collection('conversations')
      .where('participants', 'array-contains', userId)
      .orderBy('updatedAt', 'desc')
      .onSnapshot(
        snapshot => {
          const conversations = [];
          snapshot.forEach(doc => {
            conversations.push({
              id: doc.id,
              ...doc.data(),
              lastMessageTime: doc.data().lastMessageTime?.toDate?.() || new Date(),
            });
          });
          callback(conversations);
        },
        error => {
          console.error('Error listening to conversations:', error);
        }
      );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Update typing status
   */
  async setTypingStatus(conversationId, userId, isTyping) {
    try {
      await firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('typing')
        .doc(userId)
        .set({
          isTyping,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error setting typing status:', error);
    }
  }

  /**
   * Listen for typing status in a conversation
   */
  subscribeToTypingStatus(conversationId, currentUserId, callback) {
    const unsubscribe = firestore()
      .collection('conversations')
      .doc(conversationId)
      .collection('typing')
      .where('isTyping', '==', true)
      .onSnapshot(
        snapshot => {
          const typingUsers = [];
          snapshot.forEach(doc => {
            if (doc.id !== currentUserId) {
              typingUsers.push(doc.id);
            }
          });
          callback(typingUsers);
        },
        error => {
          console.error('Error listening to typing status:', error);
        }
      );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Update user online status
   */
  async setOnlineStatus(userId, isOnline) {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set({
          isOnline,
          lastSeen: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
      console.error('Error setting online status:', error);
    }
  }

  /**
   * Listen for user online status
   */
  subscribeToUserStatus(userId, callback) {
    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            callback({
              isOnline: doc.data().isOnline || false,
              lastSeen: doc.data().lastSeen?.toDate?.() || null,
            });
          }
        },
        error => {
          console.error('Error listening to user status:', error);
        }
      );

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(conversationId, userId) {
    try {
      const messagesRef = firestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .where('receiverId', '==', userId)
        .where('read', '==', false);

      const snapshot = await messagesRef.get();
      const batch = firestore().batch();

      snapshot.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Create or get conversation between two users
   */
  async getOrCreateConversation(userId1, userId2) {
    try {
      // Check if conversation already exists
      const existingConversation = await firestore()
        .collection('conversations')
        .where('participants', 'array-contains', userId1)
        .get();

      for (const doc of existingConversation.docs) {
        const participants = doc.data().participants;
        if (participants.includes(userId2)) {
          return doc.id;
        }
      }

      // Create new conversation
      const newConversation = await firestore()
        .collection('conversations')
        .add({
          participants: [userId1, userId2],
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      return newConversation.id;
    } catch (error) {
      console.error('Error getting/creating conversation:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from all listeners
   */
  unsubscribeAll() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
  }
}

export default new FirebaseService();
