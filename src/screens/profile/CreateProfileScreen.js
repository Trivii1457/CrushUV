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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {PermissionsAndroid} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import profileService from '../../services/profileService';
import userService from '../../services/userService';
import {useAuth} from '../../context/AuthContext';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';

const CreateProfileScreen = ({navigation}) => {
  const {user, refreshProfile} = useAuth();
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [bio, setBio] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // Request permissions on Android
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

  // Load existing photos on mount
  useEffect(() => {
    loadExistingPhotos();
  }, []);

  const loadExistingPhotos = async () => {
    try {
      const savedPhotos = await profileService.getLocalPhotos();
      setPhotos(savedPhotos);
    } catch (error) {
      console.log('Error loading photos:', error);
    }
  };

  const handleAddPhoto = async index => {
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

      // Pick image
      const uri = await profileService.pickImage(source);
      if (!uri) {
        setUploadingIndex(null);
        return;
      }

      // Save locally
      const savedPath = await profileService.savePhotoLocally(uri, index);

      // Update state
      const newPhotos = [...photos];
      newPhotos[index] = savedPath;
      setPhotos(newPhotos);

      setUploadingIndex(null);
    } catch (error) {
      setUploadingIndex(null);
      Alert.alert('Error', 'No se pudo guardar la foto: ' + error.message);
    }
  };

  const handleDeletePhoto = index => {
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

  const handleComplete = async () => {
    // Validate required fields
    const photosCount = photos.filter(p => p !== null).length;
    if (photosCount < 1) {
      Alert.alert('Error', 'Añade al menos 1 foto');
      return;
    }
    if (!career.trim()) {
      Alert.alert('Error', 'Ingresa tu carrera');
      return;
    }
    if (!semester.trim()) {
      Alert.alert('Error', 'Ingresa tu semestre');
      return;
    }

    setLoading(true);
    try {
      // Calculate age from birth date
      const age = userService.calculateAge(birthDate);

      // Get local photo paths
      const validPhotos = photos.filter(p => p !== null);

      // Update user profile in Firestore
      await userService.updateUser(user.uid, {
        bio,
        career,
        semester,
        birthDate,
        age,
        photos: validPhotos,
        photosCount: validPhotos.length,
        hasLocalPhotos: validPhotos.length > 0,
        isProfileComplete: true,
      });

      // Refresh auth context with new profile
      await refreshProfile();

      setLoading(false);
      Alert.alert('Éxito', 'Tu perfil ha sido creado', [
        {text: 'OK', onPress: () => navigation.replace('MainTabs')},
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo guardar el perfil: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completa tu perfil</Text>
        <Text style={styles.subtitle}>
          Añade fotos e información para que otros te conozcan
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Fotos de perfil</Text>
        <Text style={styles.sectionDescription}>
          Añade al menos 2 fotos (máximo 6)
        </Text>

        <View style={styles.photosGrid}>
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoBox}
              onPress={() => handleAddPhoto(index)}
              onLongPress={() => handleDeletePhoto(index)}>
              {uploadingIndex === index ? (
                <View style={styles.photoPlaceholder}>
                  <ActivityIndicator size="large" color={colors.primary} />
                </View>
              ) : photo ? (
                <>
                  <Image source={{uri: `file://${photo}`}} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeletePhoto(index)}>
                    <Icon name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="add" size={32} color={colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Información académica</Text>

        <Input
          label="Carrera"
          value={career}
          onChangeText={setCareer}
          placeholder="Ej: Ingeniería de Sistemas"
          iconName="school-outline"
        />

        <Input
          label="Semestre"
          value={semester}
          onChangeText={setSemester}
          placeholder="Ej: 5"
          keyboardType="numeric"
          iconName="book-outline"
        />

        <Input
          label="Fecha de Nacimiento"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="DD/MM/AAAA"
          iconName="calendar-outline"
        />

        <Text style={styles.sectionTitle}>Sobre ti</Text>

        <Input
          label="Biografía"
          value={bio}
          onChangeText={setBio}
          placeholder="Escribe algo sobre ti..."
          multiline
          numberOfLines={4}
        />

        <Button
          title="Completar Perfil"
          onPress={handleComplete}
          loading={loading}
          style={styles.completeButton}
        />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textLight,
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
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: fontSize.sm,
    color: colors.textLight,
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
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  completeButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});

export default CreateProfileScreen;
