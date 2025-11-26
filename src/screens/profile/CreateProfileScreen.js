import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';

const CreateProfileScreen = ({navigation}) => {
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [bio, setBio] = useState('');
  const [career, setCareer] = useState('');
  const [semester, setSemester] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = index => {
    // In a real app, this would open image picker
    const newPhotos = [...photos];
    newPhotos[index] = 'https://via.placeholder.com/400';
    setPhotos(newPhotos);
  };

  const handleComplete = () => {
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
    // In a real app, this would save profile to Firebase
    // Profile is complete - user is already authenticated via Firebase
    setTimeout(() => {
      setLoading(false);
      // Navigation is handled by auth state - user is already logged in
      Alert.alert('Éxito', 'Tu perfil ha sido creado');
    }, 1500);
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
              onPress={() => handleAddPhoto(index)}>
              {photo ? (
                <Image source={{uri: photo}} style={styles.photo} />
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
  completeButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});

export default CreateProfileScreen;
