import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';

const EditProfileScreen = ({navigation}) => {
  const [photos, setPhotos] = useState([
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/400',
    null,
    null,
    null,
    null,
  ]);
  const [bio, setBio] = useState('Me encanta la tecnología, el café y conocer nuevas personas.');
  const [career, setCareer] = useState('Ingeniería de Sistemas');
  const [semester, setSemester] = useState('5');
  const [interests, setInterests] = useState(['Tecnología', 'Música', 'Cine']);
  const [loading, setLoading] = useState(false);

  const handleAddPhoto = index => {
    const newPhotos = [...photos];
    newPhotos[index] = 'https://via.placeholder.com/400';
    setPhotos(newPhotos);
  };

  const handleRemovePhoto = index => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
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
              {photo ? (
                <>
                  <Image source={{uri: photo}} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemovePhoto(index)}>
                    <Icon name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.photoPlaceholder}
                  onPress={() => handleAddPhoto(index)}>
                  <Icon name="add" size={32} color={colors.primary} />
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
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
              <TouchableOpacity
                onPress={() =>
                  setInterests(interests.filter((_, i) => i !== index))
                }>
                <Icon
                  name="close-circle"
                  size={20}
                  color={colors.primary}
                  style={styles.removeInterest}
                />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addInterestButton}>
            <Icon name="add" size={20} color={colors.primary} />
            <Text style={styles.addInterestText}>Añadir interés</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Guardar Cambios"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
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
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  interestText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  removeInterest: {
    marginLeft: spacing.xs,
  },
  addInterestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addInterestText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  saveButton: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
});

export default EditProfileScreen;
