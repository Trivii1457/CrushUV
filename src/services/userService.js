import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Service for managing user data in Firestore
 */
const userService = {
  /**
   * Create a new user in Firestore
   * @param {string} uid - User ID
   * @param {Object} userData - User data to save
   * @returns {Promise<void>}
   */
  createUser: async (uid, userData) => {
    const userDoc = {
      uid,
      email: userData.email || '',
      name: userData.name || '',
      age: userData.age || null,
      career: userData.career || '',
      semester: userData.semester || '',
      bio: userData.bio || '',
      photos: userData.photos || [],
      interests: userData.interests || [],
      gender: userData.gender || '',
      lookingFor: userData.lookingFor || '',
      birthDate: userData.birthDate || '',
      isProfileComplete: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await firestore().collection('users').doc(uid).set(userDoc);
    return userDoc;
  },

  /**
   * Get user profile by ID
   * @param {string} uid - User ID
   * @returns {Promise<Object|null>}
   */
  getUser: async (uid) => {
    if (!uid) {return null;}

    try {
      const doc = await firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        return {id: doc.id, ...doc.data()};
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Update user profile
   * @param {string} uid - User ID
   * @param {Object} data - Data to update
   * @returns {Promise<void>}
   */
  updateUser: async (uid, data) => {
    if (!uid) {throw new Error('User ID is required');}

    await firestore().collection('users').doc(uid).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  },

  /**
   * Get profiles for discovery (excluding current user and already swiped profiles)
   * @param {string} currentUserId - Current user's ID
   * @param {number} limit - Maximum number of profiles to fetch
   * @returns {Promise<Array>}
   */
  getDiscoverProfiles: async (currentUserId, limit = 20) => {
    if (!currentUserId) {return [];}

    try {
      // Get all swipes by current user
      const swipesSnapshot = await firestore()
        .collection('swipes')
        .where('swiperId', '==', currentUserId)
        .get();

      const swipedUserIds = swipesSnapshot.docs.map(doc => doc.data().swipedId);
      swipedUserIds.push(currentUserId); // Also exclude current user

      // Get profiles that haven't been swiped
      const usersSnapshot = await firestore()
        .collection('users')
        .where('isProfileComplete', '==', true)
        .limit(limit + swipedUserIds.length) // Get extra to filter
        .get();

      // Filter out already swiped profiles
      const profiles = usersSnapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(profile => !swipedUserIds.includes(profile.uid))
        .slice(0, limit);

      return profiles;
    } catch (error) {
      console.error('Error getting discover profiles:', error);
      return [];
    }
  },

  /**
   * Search users by name or career
   * @param {string} query - Search query
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>}
   */
  searchUsers: async (query, limit = 20) => {
    if (!query || query.trim().length < 2) {return [];}

    const currentUser = auth().currentUser;
    if (!currentUser) {return [];}

    try {
      // Search by name (case-insensitive approximation)
      const queryLower = query.toLowerCase();
      const usersSnapshot = await firestore()
        .collection('users')
        .where('isProfileComplete', '==', true)
        .limit(limit * 2)
        .get();

      const profiles = usersSnapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(profile =>
          profile.uid !== currentUser.uid &&
          (profile.name?.toLowerCase().includes(queryLower) ||
           profile.career?.toLowerCase().includes(queryLower))
        )
        .slice(0, limit);

      return profiles;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  },

  /**
   * Subscribe to user profile changes
   * @param {string} uid - User ID
   * @param {function} onUpdate - Callback when profile updates
   * @returns {function} - Unsubscribe function
   */
  subscribeToUser: (uid, onUpdate) => {
    if (!uid) {
      onUpdate(null);
      return () => {};
    }

    return firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            onUpdate({id: doc.id, ...doc.data()});
          } else {
            onUpdate(null);
          }
        },
        error => {
          console.error('Error subscribing to user:', error);
          onUpdate(null);
        }
      );
  },

  /**
   * Calculate age from birth date
   * @param {string} birthDate - Birth date in format DD/MM/YYYY
   * @returns {number|null}
   */
  calculateAge: (birthDate) => {
    if (!birthDate) {return null;}

    const parts = birthDate.split('/');
    if (parts.length !== 3) {return null;}

    const birth = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  },
};

export default userService;
