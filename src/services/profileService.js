import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';

const PHOTOS_STORAGE_KEY = '@crushuv_photos';
const PROFILE_STORAGE_KEY = '@crushuv_profile';

/**
 * Service for managing user profiles
 * Photos are stored locally, profile data in Firestore
 */
const profileService = {
  /**
   * Pick image from gallery or camera
   * @param {string} source - 'gallery' or 'camera'
   * @returns {Promise<string|null>} - Local URI of selected image
   */
  pickImage: async (source = 'gallery') => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    return new Promise((resolve, reject) => {
      const callback = response => {
        if (response.didCancel) {
          resolve(null);
        } else if (response.errorCode) {
          reject(new Error(response.errorMessage || 'Error al seleccionar imagen'));
        } else if (response.assets && response.assets.length > 0) {
          resolve(response.assets[0].uri);
        } else {
          resolve(null);
        }
      };

      if (source === 'camera') {
        launchCamera(options, callback);
      } else {
        launchImageLibrary(options, callback);
      }
    });
  },

  /**
   * Save photo locally to app's documents directory
   * @param {string} uri - Temporary URI of the image
   * @param {number} index - Photo index (0-5)
   * @returns {Promise<string>} - Permanent local path
   */
  savePhotoLocally: async (uri, index) => {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const filename = `photo_${user.uid}_${index}_${Date.now()}.jpg`;
    const destPath = `${RNFS.DocumentDirectoryPath}/${filename}`;

    // Copy file to permanent location
    await RNFS.copyFile(uri, destPath);

    // Save reference in AsyncStorage
    const photosJson = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
    const photos = photosJson ? JSON.parse(photosJson) : {};
    
    if (!photos[user.uid]) {
      photos[user.uid] = [];
    }
    
    // Delete old photo at this index if exists
    const oldPhoto = photos[user.uid][index];
    if (oldPhoto && await RNFS.exists(oldPhoto)) {
      await RNFS.unlink(oldPhoto);
    }
    
    photos[user.uid][index] = destPath;
    await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));

    return destPath;
  },

  /**
   * Get locally saved photos for current user
   * @returns {Promise<Array>} - Array of photo paths (null for empty slots)
   */
  getLocalPhotos: async () => {
    const user = auth().currentUser;
    if (!user) {
      return [null, null, null, null, null, null];
    }

    const photosJson = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
    const photos = photosJson ? JSON.parse(photosJson) : {};
    const userPhotos = photos[user.uid] || [];

    // Verify files exist and return array of 6 slots
    const result = [];
    for (let i = 0; i < 6; i++) {
      if (userPhotos[i] && await RNFS.exists(userPhotos[i])) {
        result.push(userPhotos[i]);
      } else {
        result.push(null);
      }
    }
    return result;
  },

  /**
   * Delete a local photo
   * @param {number} index - Photo index to delete
   */
  deleteLocalPhoto: async (index) => {
    const user = auth().currentUser;
    if (!user) return;

    const photosJson = await AsyncStorage.getItem(PHOTOS_STORAGE_KEY);
    const photos = photosJson ? JSON.parse(photosJson) : {};
    
    if (photos[user.uid] && photos[user.uid][index]) {
      const photoPath = photos[user.uid][index];
      if (await RNFS.exists(photoPath)) {
        await RNFS.unlink(photoPath);
      }
      photos[user.uid][index] = null;
      await AsyncStorage.setItem(PHOTOS_STORAGE_KEY, JSON.stringify(photos));
    }
  },

  /**
   * Save user profile to Firestore (without photos, just metadata)
   * @param {Object} profileData - Profile data to save
   * @returns {Promise<void>}
   */
  saveProfile: async (profileData) => {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Get local photos count
    const localPhotos = await profileService.getLocalPhotos();
    const photosCount = localPhotos.filter(p => p !== null).length;

    const profile = {
      uid: user.uid,
      email: user.email,
      name: profileData.name || '',
      bio: profileData.bio || '',
      career: profileData.career || '',
      semester: profileData.semester || '',
      birthDate: profileData.birthDate || '',
      photosCount: photosCount,
      hasLocalPhotos: photosCount > 0,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
      isProfileComplete: true,
    };

    await firestore().collection('users').doc(user.uid).set(profile, {merge: true});

    // Also save locally for offline access
    await AsyncStorage.setItem(
      `${PROFILE_STORAGE_KEY}_${user.uid}`,
      JSON.stringify({...profile, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()})
    );
  },

  /**
   * Get user profile from Firestore or local storage
   * @param {string} userId - Optional user ID (defaults to current user)
   * @returns {Promise<Object|null>} - User profile or null
   */
  getProfile: async (userId = null) => {
    const uid = userId || auth().currentUser?.uid;
    if (!uid) {
      return null;
    }

    try {
      // Try Firestore first
      const doc = await firestore().collection('users').doc(uid).get();
      if (doc.exists) {
        const profile = {id: doc.id, ...doc.data()};
        // Cache locally
        await AsyncStorage.setItem(`${PROFILE_STORAGE_KEY}_${uid}`, JSON.stringify(profile));
        return profile;
      }
    } catch (error) {
      console.log('Firestore unavailable, using local cache:', error.message);
    }

    // Fallback to local storage
    const localProfile = await AsyncStorage.getItem(`${PROFILE_STORAGE_KEY}_${uid}`);
    return localProfile ? JSON.parse(localProfile) : null;
  },

  /**
   * Update user profile
   * @param {Object} updates - Fields to update
   * @returns {Promise<void>}
   */
  updateProfile: async (updates) => {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      await firestore().collection('users').doc(user.uid).update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log('Firestore update failed, saving locally:', error.message);
    }

    // Update local cache
    const localProfile = await AsyncStorage.getItem(`${PROFILE_STORAGE_KEY}_${user.uid}`);
    if (localProfile) {
      const profile = JSON.parse(localProfile);
      await AsyncStorage.setItem(
        `${PROFILE_STORAGE_KEY}_${user.uid}`,
        JSON.stringify({...profile, ...updates, updatedAt: new Date().toISOString()})
      );
    }
  },

  /**
   * Check if user has completed profile
   * @returns {Promise<boolean>}
   */
  isProfileComplete: async () => {
    const profile = await profileService.getProfile();
    return profile?.isProfileComplete === true;
  },

  /**
   * Get all profiles for discovery (excluding current user)
   * @param {number} limit - Maximum number of profiles to fetch
   * @returns {Promise<Array>} - Array of user profiles
   */
  getDiscoverProfiles: async (limit = 20) => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      return [];
    }

    try {
      const snapshot = await firestore()
        .collection('users')
        .where('isProfileComplete', '==', true)
        .limit(limit)
        .get();

      return snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data()}))
        .filter(profile => profile.uid !== currentUser.uid);
    } catch (error) {
      console.log('Error fetching discover profiles:', error.message);
      return [];
    }
  },
};

export default profileService;
