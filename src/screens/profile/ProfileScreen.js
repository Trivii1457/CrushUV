import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import profileService from '../../services/profileService';
import matchService from '../../services/matchService';

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
        setPhotos(validPhotos);

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
    if (!photo) {return 'https://via.placeholder.com/400x500/CCCCCC/FFFFFF?text=Sin+foto';}
    if (photo.startsWith('/') || photo.startsWith('file://')) {
      return `file://${photo.replace('file://', '')}`;
    }
    return photo;
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
          <Text style={styles.sectionTitle}>📸 Mis fotos</Text>
          <View style={styles.photosGrid}>
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <Image
                  key={index}
                  source={{uri: getPhotoUri(photo)}}
                  style={styles.gridPhoto}
                  resizeMode="cover"
                />
              ))
            ) : (
              <Text style={styles.noPhotosText}>No has subido fotos aún</Text>
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
    justifyContent: 'space-between',
  },
  gridPhoto: {
    width: '31%',
    aspectRatio: 0.75,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    ...shadows.sm,
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
    width: '100%',
    paddingVertical: spacing.lg,
  },
  buttonEmoji: {
    fontSize: 22,
  },
  schoolEmoji: {
    fontSize: 18,
  },
});

export default ProfileScreen;
