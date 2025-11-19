import React from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../theme';

const {width} = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const ProfileCard = ({profile}) => {
  const {name, age, career, semester, bio, photos, distance} = profile;

  return (
    <View style={styles.card}>
      <Image
        source={{uri: photos[0]}}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}>
        <View style={styles.infoContainer}>
          {distance && (
            <View style={styles.distanceTag}>
              <Icon name="location" size={14} color={colors.white} />
              <Text style={styles.distanceText}>{distance} km</Text>
            </View>
          )}
          <Text style={styles.name}>
            {name}, {age}
          </Text>
          <View style={styles.academicInfo}>
            <Icon name="school" size={16} color={colors.white} />
            <Text style={styles.academicText}>
              {career} - {semester} semestre
            </Text>
          </View>
          {bio && <Text style={styles.bio} numberOfLines={2}>{bio}</Text>}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
    backgroundColor: colors.white,
  },
  image: {
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
  infoContainer: {
    marginBottom: spacing.md,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  distanceText: {
    color: colors.white,
    fontSize: fontSize.xs,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
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
    marginBottom: spacing.sm,
  },
  academicText: {
    fontSize: fontSize.md,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  bio: {
    fontSize: fontSize.sm,
    color: colors.white,
    lineHeight: 20,
  },
});

export default ProfileCard;
