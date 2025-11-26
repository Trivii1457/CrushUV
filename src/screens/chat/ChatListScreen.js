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
import {colors, spacing, fontSize, fontWeight} from '../../theme';
import {useChat} from '../../context/ChatContext';

const ChatListScreen = ({navigation}) => {
  const {conversations, isConnected} = useChat();

  const renderChat = ({item}) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatDetail', {match: item})}>
      <View style={styles.avatarContainer}>
        <Image source={{uri: item.photo}} style={styles.avatar} />
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          {!isConnected && (
            <Icon name="cloud-offline-outline" size={20} color={colors.error} style={{marginRight: spacing.md}} />
          )}
          <TouchableOpacity>
            <Icon name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderChat}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.chatsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="chatbubbles-outline" size={80} color={colors.textLight} />
          <Text style={styles.emptyTitle}>No tienes conversaciones</Text>
          <Text style={styles.emptyDescription}>
            Cuando hagas match con alguien, podrás empezar a chatear aquí
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
});

export default ChatListScreen;
