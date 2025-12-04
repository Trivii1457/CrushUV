import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import matchService from '../../services/matchService';

const MatchesScreen = ({navigation}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    if (!user) {return;}

    // Subscribe to matches in real-time
    const unsubscribe = matchService.subscribeToMatches(user.uid, (matchesData) => {
      setMatches(matchesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getPhotoUri = (otherUser) => {
    if (!otherUser) {return null;}
    if (otherUser.photos && otherUser.photos.length > 0) {
      const photo = otherUser.photos[0];
      // Check if it's a local path or URL
      if (photo.startsWith('/') || photo.startsWith('file://')) {
        return `file://${photo.replace('file://', '')}`;
      }
      return photo;
    }
    return 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=?';
  };

  const renderMatch = ({item}) => {
    const otherUser = item.otherUser;
    const photoUri = getPhotoUri(otherUser);
    const age = otherUser?.age ||
      (otherUser?.birthDate ? calculateAge(otherUser.birthDate) : '?');

    // Check if match is new (less than 24 hours old and no messages)
    const matchDate = item.createdAt instanceof Date ? item.createdAt : new Date();
    const isNew = item.isNew && (new Date() - matchDate) < 24 * 60 * 60 * 1000;

    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => navigation.navigate('ChatDetail', {
          match: {
            id: item.id,
            matchId: item.id,
            name: otherUser?.name || 'Usuario',
            photo: photoUri,
            otherUser,
          },
        })}>
        <View style={styles.matchImageContainer}>
          <Image
            source={{uri: photoUri}}
            style={styles.matchImage}
          />
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NUEVO</Text>
            </View>
          )}
        </View>
        <Text style={styles.matchName} numberOfLines={1}>
          {otherUser?.name || 'Usuario'}
        </Text>
        <Text style={styles.matchAge}>{age} años</Text>
      </TouchableOpacity>
    );
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) {return '?';}
    const parts = birthDate.split('/');
    if (parts.length !== 3) {return '?';}
    const birth = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💕 Matches</Text>
        <TouchableOpacity>
          <Text style={styles.searchEmoji}>🔍</Text>
        </TouchableOpacity>
      </View>

      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.matchesList}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💔</Text>
          <Text style={styles.emptyTitle}>No tienes matches aún</Text>
          <Text style={styles.emptyDescription}>
            Empieza a deslizar para encontrar a alguien especial 💘
          </Text>
        </View>
      )}
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
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  matchesList: {
    padding: spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  matchCard: {
    width: '48%',
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  matchImageContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  matchImage: {
    width: 150,
    height: 200,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  newBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  matchName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  matchAge: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  emptyEmoji: {
    fontSize: 80,
  },
  searchEmoji: {
    fontSize: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});

export default MatchesScreen;
