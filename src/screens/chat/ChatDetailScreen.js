import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import chatService from '../../services/chatService';

const ChatDetailScreen = ({route, navigation}) => {
  const {match} = route.params || {};
  const {user} = useAuth();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const matchId = match?.id || match?.matchId;
  const otherUser = match?.otherUser;
  const otherUserName = match?.name || otherUser?.name || 'Usuario';
  const otherUserPhoto = match?.photo || (otherUser?.photos?.[0]
    ? (otherUser.photos[0].startsWith('/')
      ? `file://${otherUser.photos[0]}`
      : otherUser.photos[0])
    : 'https://via.placeholder.com/60/CCCCCC/FFFFFF?text=?');

  useEffect(() => {
    if (!matchId || !user) {return;}

    // Subscribe to messages in real-time
    const unsubscribeMessages = chatService.subscribeToMessages(
      matchId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
      }
    );

    // Subscribe to typing status
    const unsubscribeTyping = chatService.subscribeToTyping(
      matchId,
      user.uid,
      setIsOtherTyping
    );

    // Mark messages as read
    chatService.markAsRead(matchId, user.uid);

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      chatService.setTypingStatus(matchId, false);
    };
  }, [matchId, user]);

  // Handle text input change
  const handleTextChange = (text) => {
    setInputText(text);

    // Send typing indicator
    if (text.trim()) {
      chatService.setTypingStatus(matchId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing indicator after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        chatService.setTypingStatus(matchId, false);
      }, 2000);
    } else {
      chatService.setTypingStatus(matchId, false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !matchId) {return;}

    const text = inputText;
    setInputText('');
    chatService.setTypingStatus(matchId, false);

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await chatService.sendMessage(matchId, text);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const formatTime = (date) => {
    if (!date) {return '';}
    if (typeof date.toLocaleTimeString === 'function') {
      return date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '';
  };

  const renderMessage = ({item}) => {
    const isMe = item.senderId === user?.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}>
        {!isMe && (
          <Image source={{uri: otherUserPhoto}} style={styles.messageAvatar} />
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}>
          {item.type === 'image' && item.image ? (
            <Image source={{uri: item.image}} style={styles.messageImage} />
          ) : (
            <Text
              style={[
                styles.messageText,
                isMe && styles.myMessageText,
              ]}>
              {item.text}
            </Text>
          )}
          <Text
            style={[
              styles.timestamp,
              isMe && styles.myTimestamp,
            ]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.headerEmoji}>⬅️</Text>
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image source={{uri: otherUserPhoto}} style={styles.headerAvatar} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUserName}</Text>
          <Text style={styles.statusText}>
            {isOtherTyping ? 'Escribiendo...' : ''}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerEmoji}>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerEmoji}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyMessagesText}>
              ¡Di hola! Inicia la conversación 👋
            </Text>
          </View>
        }
      />

      {isOtherTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {otherUserName} está escribiendo...
          </Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachEmoji}>➕</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleTextChange}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={colors.textLight}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendEmoji}>📤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: spacing.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: spacing.md,
  },
  messagesList: {
    padding: spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: spacing.xs,
  },
  theirMessageBubble: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: spacing.xs,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  myMessageText: {
    color: colors.white,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.textLight,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  attachButton: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyMessagesText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
  },
  typingContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  typingText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  headerEmoji: {
    fontSize: 22,
  },
  attachEmoji: {
    fontSize: 26,
  },
  sendEmoji: {
    fontSize: 20,
  },
});

export default ChatDetailScreen;
