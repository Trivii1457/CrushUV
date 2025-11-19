import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileCard from '../../components/ProfileCard';
import {colors, spacing, shadows} from '../../theme';

const {width, height} = Dimensions.get('window');

const DiscoverScreen = () => {
  const [profiles] = useState([
    {
      id: 1,
      name: 'Ana María',
      age: 21,
      career: 'Psicología',
      semester: '6',
      bio: 'Amante de los libros y el arte. Busco conversaciones interesantes 📚🎨',
      photos: ['https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=Ana'],
      distance: 0.5,
    },
    {
      id: 2,
      name: 'Carlos',
      age: 23,
      career: 'Ingeniería Industrial',
      semester: '8',
      bio: 'Fanático del fútbol y la música. Siempre listo para una aventura ⚽🎵',
      photos: ['https://via.placeholder.com/400x600/4ECDC4/FFFFFF?text=Carlos'],
      distance: 1.2,
    },
    {
      id: 3,
      name: 'Sofía',
      age: 20,
      career: 'Diseño Gráfico',
      semester: '4',
      bio: 'Creativa y soñadora. Me encanta el café y las buenas películas ☕🎬',
      photos: ['https://via.placeholder.com/400x600/95E1D3/FFFFFF?text=Sofia'],
      distance: 0.8,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({x: gesture.dx, y: gesture.dy});
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          handleSwipeRight();
        } else if (gesture.dx < -120) {
          handleSwipeLeft();
        } else {
          Animated.spring(position, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const handleSwipeRight = () => {
    Animated.timing(position, {
      toValue: {x: width + 100, y: 0},
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const handleSwipeLeft = () => {
    Animated.timing(position, {
      toValue: {x: -width - 100, y: 0},
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({x: 0, y: 0});
    });
  };

  const handleSuperLike = () => {
    Animated.timing(position, {
      toValue: {x: 0, y: -height},
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex(currentIndex + 1);
      position.setValue({x: 0, y: 0});
    });
  };

  if (currentIndex >= profiles.length) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Icon name="people-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyTitle}>¡No hay más perfiles!</Text>
          <Text style={styles.emptyDescription}>
            Vuelve más tarde para descubrir nuevas personas
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="flame" size={32} color={colors.primary} />
        <Text style={styles.headerTitle}>CrushUV</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="options-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        {/* Next Card Preview */}
        {currentIndex < profiles.length - 1 && (
          <View style={[styles.card, styles.nextCard]}>
            <ProfileCard profile={profiles[currentIndex + 1]} />
          </View>
        )}

        {/* Current Card */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                {translateX: position.x},
                {translateY: position.y},
                {rotate: rotate},
              ],
            },
          ]}>
          <ProfileCard profile={profiles[currentIndex]} />

          {/* Like Stamp */}
          <Animated.View
            style={[styles.stamp, styles.likeStamp, {opacity: likeOpacity}]}>
            <Text style={styles.stampText}>ME GUSTA</Text>
          </Animated.View>

          {/* Nope Stamp */}
          <Animated.View
            style={[styles.stamp, styles.nopeStamp, {opacity: nopeOpacity}]}>
            <Text style={styles.stampText}>NOPE</Text>
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.nopeButton]}
          onPress={handleSwipeLeft}>
          <Icon name="close" size={32} color={colors.error} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={handleSuperLike}>
          <Icon name="star" size={24} color={colors.warning} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={handleSwipeRight}>
          <Icon name="heart" size={32} color={colors.success} />
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  filterButton: {
    padding: spacing.xs,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
  },
  nextCard: {
    transform: [{scale: 0.95}],
    opacity: 0.5,
  },
  stamp: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 4,
    borderRadius: spacing.sm,
    transform: [{rotate: '-20deg'}],
  },
  likeStamp: {
    right: 30,
    borderColor: colors.success,
  },
  nopeStamp: {
    left: 30,
    borderColor: colors.error,
  },
  stampText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    ...shadows.md,
  },
  nopeButton: {
    borderWidth: 2,
    borderColor: colors.error,
  },
  superLikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.warning,
  },
  likeButton: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});

export default DiscoverScreen;
