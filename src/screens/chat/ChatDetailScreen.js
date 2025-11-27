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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, spacing, borderRadius, fontSize, fontWeight} from '../../theme';
import {useChat} from '../../context/ChatContext';

const ChatDetailScreen = ({route, navigation}) => {
  const {match} = route.params || {
    match: {
      id: 'conv_1',
      matchId: 1,
      name: 'Ana María',
      photo: 'https://via.placeholder.com/60/FF6B6B/FFFFFF?text=A',
    },
  };

  const {
    sendMessage,
    getConversationMessages,
    joinConversation,
    leaveConversation,
    setTypingStatus,
    markConversationAsRead,
    isConnected,
    typingUsers,
    onlineUsers,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const conversationId = match.id || `conv_${match.matchId}`;
  const isOnline = onlineUsers[match.matchId];
  const isTyping = typingUsers[conversationId];

  // Join conversation on mount
  useEffect(() => {
    joinConversation(conversationId);
    markConversationAsRead(conversationId);

    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, markConversationAsRead, leaveConversation]);

  // Update messages when conversation changes
  useEffect(() => {
    const conversationMessages = getConversationMessages(conversationId);
    setMessages(conversationMessages);

    // Scroll to bottom when new messages arrive
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
  }, [conversationId, getConversationMessages]);

  // Handle text input change
  const handleTextChange = (text) => {
    setInputText(text);

    // Send typing indicator
    if (text.trim()) {
      setTypingStatus(conversationId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing indicator after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(conversationId, false);
      }, 2000);
    } else {
      setTypingStatus(conversationId, false);
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(conversationId, inputText.trim(), match.matchId);
      setInputText('');
      setTypingStatus(conversationId, false);

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      ]}>
      {item.sender === 'them' && (
        <Image source={{uri: match.photo}} style={styles.messageAvatar} />
      )}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'me'
            ? styles.myMessageBubble
            : styles.theirMessageBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            item.sender === 'me' && styles.myMessageText,
          ]}>
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.sender === 'me' && styles.myTimestamp,
          ]}>
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image source={{uri: match.photo}} style={styles.headerAvatar} />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{match.name}</Text>
          <Text style={styles.statusText}>
            {isTyping ? 'Escribiendo...' : isOnline ? 'En línea' : 'Desconectado'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {!isConnected && (
            <Icon name="cloud-offline-outline" size={20} color={colors.error} style={{marginRight: spacing.sm}} />
          )}
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="videocam-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="add-circle-outline" size={28} color={colors.primary} />
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
          <Icon name="send" size={24} color={colors.white} />
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
});

export default ChatDetailScreen;
