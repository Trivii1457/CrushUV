import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import profileService from '../../services/profileService';
import matchService from '../../services/matchService';

const {width: screenWidth} = Dimensions.get('window');
const photoSize = (screenWidth - spacing.lg * 2 - spacing.sm * 2) / 3;

// Componente de foto individual con estado de carga
const PhotoItem = ({uri, index}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={[styles.gridPhotoContainer, {width: photoSize, height: photoSize * 1.33}]}>
      {loading && !error && (
        <View style={styles.photoLoading}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      {error ? (
        <View style={styles.photoError}>
          <Text style={styles.photoErrorEmoji}>🖼️</Text>
          <Text style={styles.photoErrorText}>Error</Text>
        </View>
      ) : (
        <Image
          source={{uri}}
          style={styles.gridPhoto}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(e) => {
            console.log(`Error cargando foto ${index}:`, uri, e.nativeEvent?.error);
            setError(true);
            setLoading(false);
          }}
        />
      )}
    </View>
  );
};

const ProfileScreen = ({navigation}) => {
  const {user, profile, refreshProfile} = useAuth();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    matches: 0,
    likes: 0,
    superLikes: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) {return;}

      try {
        // Load local photos
        const localPhotos = await profileService.getLocalPhotos();
        const validPhotos = localPhotos.filter(p => p !== null);
        console.log('ProfileScreen - Fotos locales cargadas:', {
          total: localPhotos.length,
          validas: validPhotos.length,
          paths: validPhotos,
        });
        
        // Si hay fotos locales, usarlas
        if (validPhotos.length > 0) {
          setPhotos(validPhotos);
        }

        // Load matches count
        const matches = await matchService.getMatches(user.uid);
        setStats({
          matches: matches.length,
          likes: 0, // Would need separate tracking
          superLikes: 0, // Would need separate tracking
        });

        // Refresh profile from Firestore
        await refreshProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cargar fotos del perfil de Firestore como respaldo
  useEffect(() => {
    if (profile?.photos && profile.photos.length > 0 && photos.length === 0) {
      console.log('ProfileScreen - Usando fotos del perfil Firestore:', profile.photos);
      setPhotos(profile.photos.filter(p => p !== null));
    }
  }, [profile, photos.length]);

  const calculateAge = (birthDate) => {
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
  };

  const getPhotoUri = (photo) => {
    if (!photo) {
      return 'https://via.placeholder.com/400x500/CCCCCC/FFFFFF?text=Sin+foto';
    }
    if (typeof photo === 'string') {
      // Log para debug
      console.log('getPhotoUri - input:', photo);
      
      // Si ya tiene file://, usarlo tal cual
      if (photo.startsWith('file://')) {
        console.log('getPhotoUri - output (ya tiene file://):', photo);
        return photo;
      }
      
      // Si es una ruta absoluta, agregar file://
      if (photo.startsWith('/')) {
        const uri = `file://${photo}`;
        console.log('getPhotoUri - output (agregando file://):', uri);
        return uri;
      }
      
      // Si es una URL http/https, usarla tal cual
      if (photo.startsWith('http://') || photo.startsWith('https://')) {
        return photo;
      }
      
      // Caso por defecto: asumir que es una ruta relativa
      console.log('getPhotoUri - ruta no reconocida:', photo);
      return photo;
    }
    return 'https://via.placeholder.com/400x500/CCCCCC/FFFFFF?text=Sin+foto';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const displayName = profile?.name || user?.displayName || 'Usuario';
  const age = profile?.age || calculateAge(profile?.birthDate);
  const career = profile?.career || '';
  const semester = profile?.semester || '';
  const bio = profile?.bio || 'Sin biografía aún';
  const interests = profile?.interests || [];
  const mainPhoto = photos.length > 0 ? getPhotoUri(photos[0]) : 'https://via.placeholder.com/400x500/CCCCCC/FFFFFF?text=Sin+foto';

  const statsDisplay = [
    {label: 'Matches', value: stats.matches.toString()},
    {label: 'Me gusta', value: stats.likes.toString()},
    {label: 'Super Likes', value: stats.superLikes.toString()},
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.headerImage}>
          <Image
            source={{uri: mainPhoto}}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.gradient}>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {displayName}{age ? `, ${age}` : ''}
              </Text>
              {(career || semester) && (
                <View style={styles.academicInfo}>
                  <Text style={styles.schoolEmoji}>🎓</Text>
                  <Text style={styles.academicText}>
                    {career}{semester ? ` - ${semester} semestre` : ''}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.buttonEmoji}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.buttonEmoji}>✏️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {statsDisplay.map((stat, index) => (
            <View key={index} style={styles.statBox}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Sobre mí</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>

        {interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Intereses</Text>
            <View style={styles.interestsContainer}>
              {interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Mis fotos ({photos.length})</Text>
          <View style={styles.photosGrid}>
            {photos.length > 0 ? (
              photos.map((photo, index) => {
                const uri = getPhotoUri(photo);
                return <PhotoItem key={index} uri={uri} index={index} />;
              })
            ) : (
              <View style={styles.noPhotosContainer}>
                <Text style={styles.noPhotosEmoji}>📷</Text>
                <Text style={styles.noPhotosText}>No has subido fotos aún</Text>
                <TouchableOpacity 
                  style={styles.addPhotosButton}
                  onPress={() => navigation.navigate('EditProfile')}>
                  <Text style={styles.addPhotosText}>Añadir fotos</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  headerImage: {
    width: '100%',
    height: 500,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  profileInfo: {
    marginBottom: spacing.md,
  },
  name: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  academicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  academicText: {
    fontSize: fontSize.md,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  settingsButton: {
    position: 'absolute',
    top: spacing.xxl,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    marginTop: -spacing.lg,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  bio: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
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
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: spacing.sm,
  },
  gridPhotoContainer: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
  },
  photoLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  photoError: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  photoErrorEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  photoErrorText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  noPhotosText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  noPhotosContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  noPhotosEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  addPhotosButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  addPhotosText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.sm,
  },
  buttonEmoji: {
    fontSize: 22,
  },
  schoolEmoji: {
    fontSize: 18,
  },
});

export default ProfileScreen;
