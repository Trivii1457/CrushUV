import firestore from '@react-native-firebase/firestore';
import userService from './userService';

/**
 * Service for managing matches and swipes in Firestore
 */
const matchService = {
  /**
   * Record a swipe action
   * @param {string} swiperId - ID of the user who swiped
   * @param {string} swipedId - ID of the user who was swiped on
   * @param {string} direction - 'left' or 'right'
   * @returns {Promise<{isMatch: boolean, matchId: string|null}>}
   */
  recordSwipe: async (swiperId, swipedId, direction) => {
    if (!swiperId || !swipedId) {
      throw new Error('Both user IDs are required');
    }

    const swipeData = {
      swiperId,
      swipedId,
      direction,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isMatch: false,
    };

    // Add the swipe record
    const swipeRef = await firestore().collection('swipes').add(swipeData);

    // If it's a right swipe (like), check for mutual match
    if (direction === 'right') {
      const isMatch = await matchService.checkForMatch(swiperId, swipedId);

      if (isMatch) {
        // Create the match
        const matchId = await matchService.createMatch(swiperId, swipedId);

        // Update swipe to indicate match
        await swipeRef.update({isMatch: true});

        return {isMatch: true, matchId};
      }
    }

    return {isMatch: false, matchId: null};
  },

  /**
   * Check if there's a mutual match between two users
   * @param {string} user1Id - First user ID
   * @param {string} user2Id - Second user ID
   * @returns {Promise<boolean>}
   */
  checkForMatch: async (user1Id, user2Id) => {
    try {
      // Check if user2 has already swiped right on user1
      const existingSwipe = await firestore()
        .collection('swipes')
        .where('swiperId', '==', user2Id)
        .where('swipedId', '==', user1Id)
        .where('direction', '==', 'right')
        .limit(1)
        .get();

      return !existingSwipe.empty;
    } catch (error) {
      console.error('Error checking for match:', error);
      return false;
    }
  },

  /**
   * Create a match between two users
   * @param {string} user1Id - First user ID
   * @param {string} user2Id - Second user ID
   * @returns {Promise<string>} - Match ID
   */
  createMatch: async (user1Id, user2Id) => {
    // Check if match already exists
    const existingMatch = await firestore()
      .collection('matches')
      .where('users', 'array-contains', user1Id)
      .get();

    for (const doc of existingMatch.docs) {
      const users = doc.data().users;
      if (users.includes(user2Id)) {
        // Match already exists
        return doc.id;
      }
    }

    // Create new match
    const matchData = {
      users: [user1Id, user2Id],
      user1: user1Id,
      user2: user2Id,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastMessage: '',
      lastMessageAt: firestore.FieldValue.serverTimestamp(),
      isActive: true,
    };

    const matchRef = await firestore().collection('matches').add(matchData);
    return matchRef.id;
  },

  /**
   * Get all matches for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  getMatches: async (userId) => {
    if (!userId) {return [];}

    try {
      const matchesSnapshot = await firestore()
        .collection('matches')
        .where('users', 'array-contains', userId)
        .where('isActive', '==', true)
        .orderBy('createdAt', 'desc')
        .get();

      const matches = await Promise.all(
        matchesSnapshot.docs.map(async doc => {
          const matchData = doc.data();
          const otherUserId = matchData.users.find(id => id !== userId);

          // Get other user's profile
          const otherUser = await userService.getUser(otherUserId);

          return {
            id: doc.id,
            ...matchData,
            otherUser,
            createdAt: matchData.createdAt?.toDate?.() || new Date(),
            lastMessageAt: matchData.lastMessageAt?.toDate?.() || new Date(),
            isNew: matchData.lastMessage === '' || !matchData.lastMessage,
          };
        })
      );

      return matches;
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  },

  /**
   * Subscribe to matches in real-time
   * @param {string} userId - User ID
   * @param {function} onMatches - Callback when matches update
   * @returns {function} - Unsubscribe function
   */
  subscribeToMatches: (userId, onMatches) => {
    if (!userId) {
      onMatches([]);
      return () => {};
    }

    return firestore()
      .collection('matches')
      .where('users', 'array-contains', userId)
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        async snapshot => {
          try {
            const matches = await Promise.all(
              snapshot.docs.map(async doc => {
                const matchData = doc.data();
                const otherUserId = matchData.users.find(id => id !== userId);
                const otherUser = await userService.getUser(otherUserId);

                return {
                  id: doc.id,
                  ...matchData,
                  otherUser,
                  createdAt: matchData.createdAt?.toDate?.() || new Date(),
                  lastMessageAt: matchData.lastMessageAt?.toDate?.() || new Date(),
                  isNew: matchData.lastMessage === '' || !matchData.lastMessage,
                };
              })
            );
            onMatches(matches);
          } catch (error) {
            console.error('Error processing matches:', error);
            onMatches([]);
          }
        },
        error => {
          console.error('Error subscribing to matches:', error);
          onMatches([]);
        }
      );
  },

  /**
   * Delete a match (soft delete)
   * @param {string} matchId - Match ID
   * @returns {Promise<void>}
   */
  deleteMatch: async (matchId) => {
    await firestore().collection('matches').doc(matchId).update({
      isActive: false,
      deletedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Get match by ID
   * @param {string} matchId - Match ID
   * @returns {Promise<Object|null>}
   */
  getMatch: async (matchId) => {
    if (!matchId) {return null;}

    try {
      const doc = await firestore().collection('matches').doc(matchId).get();
      if (doc.exists) {
        return {id: doc.id, ...doc.data()};
      }
      return null;
    } catch (error) {
      console.error('Error getting match:', error);
      return null;
    }
  },
};

export default matchService;
