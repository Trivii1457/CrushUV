import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Modal,
  TextInput,
} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import profileService from '../../services/profileService';
import userService from '../../services/userService';

const EditProfileScreen = ({navigation}) => {
  const {user, profile, refreshProfile} = useAuth();
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [bio, setBio] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState('');
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {return;}

      try {
        // Load local photos
        const localPhotos = await profileService.getLocalPhotos();
        setPhotos(localPhotos);

        // Load profile data
        if (profile) {
          setBio(profile.bio || '');
          setCareer(profile.career || '');
          setSemester(profile.semester || '');
          setInterests(profile.interests || []);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [user, profile]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleAddPhoto = async (index) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara y galería');
      return;
    }

    Alert.alert(
      'Añadir foto',
      '¿De dónde quieres obtener la foto?',
      [
        {
          text: 'Cámara',
          onPress: () => pickAndSavePhoto('camera', index),
        },
        {
          text: 'Galería',
          onPress: () => pickAndSavePhoto('gallery', index),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
    );
  };

  const pickAndSavePhoto = async (source, index) => {
    try {
      setUploadingIndex(index);

      const uri = await profileService.pickImage(source);
      if (!uri) {
        setUploadingIndex(null);
        return;
      }

      const savedPath = await profileService.savePhotoLocally(uri, index);

      const newPhotos = [...photos];
      newPhotos[index] = savedPath;
      setPhotos(newPhotos);

      setUploadingIndex(null);
    } catch (error) {
      setUploadingIndex(null);
      Alert.alert('Error', 'No se pudo guardar la foto: ' + error.message);
    }
  };

  const handleRemovePhoto = (index) => {
    if (!photos[index]) {return;}

    Alert.alert(
      'Eliminar foto',
      '¿Estás seguro de que quieres eliminar esta foto?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await profileService.deleteLocalPhoto(index);
              const newPhotos = [...photos];
              newPhotos[index] = null;
              setPhotos(newPhotos);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la foto');
            }
          },
        },
      ],
    );
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      // Update profile in Firestore
      await userService.updateUser(user.uid, {
        bio,
        career,
        semester,
        interests,
        photosCount: photos.filter(p => p !== null).length,
        hasLocalPhotos: photos.filter(p => p !== null).length > 0,
      });

      await refreshProfile();

      setLoading(false);
      Alert.alert('Éxito', 'Tu perfil ha sido actualizado', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo actualizar el perfil: ' + error.message);
    }
  };

  const getPhotoUri = (photo) => {
    if (!photo) {return null;}
    if (photo.startsWith('/') || photo.startsWith('file://')) {
      return `file://${photo.replace('file://', '')}`;
    }
    return photo;
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Fotos</Text>
        <View style={styles.photosGrid}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.photoBox}>
              {uploadingIndex === index ? (
                <View style={styles.photoPlaceholder}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : photo ? (
                <>
                  <Image source={{uri: getPhotoUri(photo)}} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemovePhoto(index)}>
                    <Text style={styles.removeEmoji}>❌</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.photoPlaceholder}
                  onPress={() => handleAddPhoto(index)}>
                  <Text style={styles.addEmoji}>➕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Información</Text>

        <Input
          label="Carrera"
          value={career}
          onChangeText={setCareer}
          placeholder="Tu carrera"
          iconName="school-outline"
        />

        <Input
          label="Semestre"
          value={semester}
          onChangeText={setSemester}
          placeholder="Tu semestre"
          keyboardType="numeric"
          iconName="book-outline"
        />

        <Input
          label="Biografía"
          value={bio}
          onChangeText={setBio}
          placeholder="Escribe algo sobre ti..."
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Intereses</Text>
        <View style={styles.interestsContainer}>
          {interests.map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={styles.interestTag}
              onPress={() => {
                Alert.alert(
                  'Eliminar interés',
                  `¿Quieres eliminar "${interest}"?`,
                  [
                    {text: 'Cancelar', style: 'cancel'},
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: () => {
                        setInterests(interests.filter((_, i) => i !== index));
                      },
                    },
                  ],
                );
              }}>
              <Text style={styles.interestText}>{interest}</Text>
              <Text style={styles.interestDeleteIcon}>✕</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addInterestButton}
            onPress={() => setShowInterestModal(true)}>
            <Text style={styles.addEmoji}>➕</Text>
            <Text style={styles.addInterestText}>Añadir interés</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />

        {/* Modal para añadir interés */}
        <Modal
          visible={showInterestModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowInterestModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Añadir interés</Text>
              <TextInput
                style={styles.modalInput}
                value={newInterest}
                onChangeText={setNewInterest}
                placeholder="Ej: Música, Deportes, Películas..."
                placeholderTextColor={colors.textMuted}
                autoFocus
                maxLength={30}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={() => {
                    setNewInterest('');
                    setShowInterestModal(false);
                  }}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalAddButton]}
                  onPress={() => {
                    if (newInterest.trim()) {
                      if (interests.length >= 10) {
                        Alert.alert('Límite', 'Máximo 10 intereses');
                        return;
                      }
                      if (interests.includes(newInterest.trim())) {
                        Alert.alert('Duplicado', 'Este interés ya existe');
                        return;
                      }
                      setInterests([...interests, newInterest.trim()]);
                      setNewInterest('');
                      setShowInterestModal(false);
                    }
                  }}>
                  <Text style={styles.modalAddText}>Añadir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  backEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  photoBox: {
    width: '31%',
    aspectRatio: 0.75,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.sm,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  interestText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  interestDeleteIcon: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontSize: 12,
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.sm,
  },
  addInterestText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginLeft: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  removeEmoji: {
    fontSize: 18,
  },
  addEmoji: {
    fontSize: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 340,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.textDark,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalCancelButton: {
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  modalCancelText: {
    color: colors.textLight,
    fontWeight: fontWeight.medium,
  },
  modalAddButton: {
    marginLeft: spacing.sm,
    backgroundColor: colors.primary,
  },
  modalAddText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
});

export default EditProfileScreen;
