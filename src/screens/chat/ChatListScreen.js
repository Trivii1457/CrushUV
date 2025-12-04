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
import {colors, spacing, fontSize, fontWeight} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import chatService from '../../services/chatService';

const ChatListScreen = ({navigation}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  useEffect(() => {
    if (!user) {return;}

    // Subscribe to conversations in real-time
    const unsubscribe = chatService.subscribeToConversations(
      user.uid,
      (convos) => {
        setConversations(convos);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const getPhotoUri = (otherUser) => {
    if (!otherUser) {return 'https://via.placeholder.com/60/CCCCCC/FFFFFF?text=?';}
    if (otherUser.photos && otherUser.photos.length > 0) {
      const photo = otherUser.photos[0];
      if (photo.startsWith('/') || photo.startsWith('file://')) {
        return `file://${photo.replace('file://', '')}`;
      }
      return photo;
    }
    return 'https://via.placeholder.com/60/CCCCCC/FFFFFF?text=?';
  };

  const formatTimestamp = (date) => {
    if (!date) {return '';}
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) {return 'Ahora';}
    if (diff < 3600000) {return `${Math.floor(diff / 60000)}m`;}
    if (diff < 86400000) {return `${Math.floor(diff / 3600000)}h`;}
    if (diff < 604800000) {return `${Math.floor(diff / 86400000)}d`;}

    return date.toLocaleDateString();
  };

  const renderChat = ({item}) => {
    const otherUser = item.otherUser;
    const photoUri = getPhotoUri(otherUser);
    const timestamp = formatTimestamp(item.lastMessageAt);
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatDetail', {
          match: {
            id: item.id,
            matchId: item.id,
            name: otherUser?.name || 'Usuario',
            photo: photoUri,
            otherUser,
          },
        })}>
        <View style={styles.avatarContainer}>
          <Image source={{uri: photoUri}} style={styles.avatar} />
          {otherUser?.isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherUser?.name || 'Usuario'}</Text>
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text
              style={[
                styles.lastMessage,
                unreadCount > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}>
              {item.lastMessage || 'Sin mensajes aún'}
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>💬 Chats</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Text style={styles.searchEmoji}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderChat}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💭</Text>
          <Text style={styles.emptyTitle}>No tienes conversaciones</Text>
          <Text style={styles.emptyDescription}>
            Cuando hagas match con alguien, podrás empezar a chatear aquí 😊
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatsList: {
    paddingVertical: spacing.sm,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  unreadMessage: {
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  unreadCount: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
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

export default ChatListScreen;
