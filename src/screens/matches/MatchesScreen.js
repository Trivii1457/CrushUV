import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight, shadows} from '../../theme';

const MatchesScreen = ({navigation}) => {
  const matches = [
    {
      id: 1,
      name: 'Ana María',
      age: 21,
      photo: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Ana',
      isNew: true,
      matchDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'Carlos',
      age: 23,
      photo: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Carlos',
      isNew: true,
      matchDate: '2024-01-14',
    },
    {
      id: 3,
      name: 'Sofía',
      age: 20,
      photo: 'https://via.placeholder.com/150/95E1D3/FFFFFF?text=Sofia',
      isNew: false,
      matchDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'Diego',
      age: 22,
      photo: 'https://via.placeholder.com/150/F38181/FFFFFF?text=Diego',
      isNew: false,
      matchDate: '2024-01-08',
    },
  ];

  const renderMatch = ({item}) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => navigation.navigate('ChatDetail', {match: item})}>
      <View style={styles.matchImageContainer}>
        <Image source={{uri: item.photo}} style={styles.matchImage} />
        {item.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NUEVO</Text>
          </View>
        )}
      </View>
      <Text style={styles.matchName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.matchAge}>{item.age} años</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <TouchableOpacity>
          <Icon name="search-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {matches.length > 0 ? (
        <FlatList
          data={matches}
          renderItem={renderMatch}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.matchesList}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="heart-dislike-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No tienes matches aún</Text>
          <Text style={styles.emptyDescription}>
            Empieza a deslizar para encontrar a alguien especial
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
});

export default MatchesScreen;
