# 🔥 CrushUV - Implementación Completa con Firebase

## Contexto del Proyecto

**CrushUV** es una aplicación de citas para estudiantes de la Universidad del Valle, construida con React Native 0.76.0. El proyecto ya tiene configurado:

- ✅ Firebase Authentication (Email/Password habilitado)
- ✅ Firebase Firestore (Base de datos habilitada)
- ✅ Estructura de navegación (Auth Stack + Main Tabs)
- ✅ Pantallas creadas (Login, Register, CreateProfile, Discover, Matches, Chat, Profile, Settings)

---

## Estructura actual del proyecto

```
src/
├── App.js                          # Punto de entrada con providers
├── components/
│   ├── Button.js
│   ├── Input.js
│   ├── ProfileCard.js
│   └── index.js
├── context/
│   ├── AuthContext.js              # Contexto de autenticación
│   └── ChatContext.js              # Contexto de chat (modo demo)
├── navigation/
│   └── AppNavigator.js             # Navegación Auth/Main
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── EmailVerificationScreen.js
│   ├── chat/
│   │   ├── ChatListScreen.js
│   │   └── ChatDetailScreen.js
│   ├── discover/
│   │   └── DiscoverScreen.js
│   ├── matches/
│   │   └── MatchesScreen.js        # Actualmente usa datos hardcodeados
│   ├── profile/
│   │   ├── CreateProfileScreen.js
│   │   ├── EditProfileScreen.js
│   │   └── ProfileScreen.js
│   └── settings/
│       └── SettingsScreen.js
├── services/
│   ├── firebaseService.js
│   ├── profileService.js           # Servicio de perfil con fotos locales
│   └── socketService.js            # Deshabilitado
└── theme/
    └── index.js
```

---

## Configuración Firebase

```
Proyecto: crush-uv-56404
Package Android: com.crushuv
Servicios habilitados:
  - Authentication (Email/Password)
  - Firestore Database
```

---

## Requerimientos de implementación

### 1. **Eliminar todos los datos hardcodeados**

Actualmente las siguientes pantallas usan datos precargados que deben ser reemplazados por datos de Firestore:

- `src/screens/matches/MatchesScreen.js` - Array `matches` hardcodeado
- `DiscoverScreen.js` - Perfiles de ejemplo
- `ChatListScreen.js` - Conversaciones de ejemplo
- `ChatDetailScreen.js` - Mensajes de ejemplo

### 2. **Estructura de Firestore a implementar**

```
📁 users (colección)
   └── 📄 {userId}
       ├── uid: string
       ├── email: string
       ├── name: string
       ├── age: number
       ├── career: string
       ├── semester: string
       ├── bio: string
       ├── photos: string[] (rutas locales o URLs base64)
       ├── interests: string[]
       ├── gender: string
       ├── lookingFor: string
       ├── createdAt: timestamp
       └── updatedAt: timestamp

📁 swipes (colección)
   └── 📄 {swipeId}
       ├── swiperId: string (quien hizo swipe)
       ├── swipedId: string (a quien le hizo swipe)
       ├── direction: "left" | "right"
       ├── createdAt: timestamp
       └── isMatch: boolean

📁 matches (colección)
   └── 📄 {matchId}
       ├── users: string[] (array con 2 userIds)
       ├── user1: string
       ├── user2: string
       ├── createdAt: timestamp
       ├── lastMessage: string
       ├── lastMessageAt: timestamp
       └── isActive: boolean

📁 messages (colección)
   └── 📄 {matchId}
       └── 📁 chat (subcolección)
           └── 📄 {messageId}
               ├── text: string
               ├── senderId: string
               ├── senderName: string
               ├── createdAt: timestamp
               ├── read: boolean
               └── type: "text" | "image"
```

### 3. **Servicios a crear/actualizar**

```javascript
// src/services/userService.js
- createUser(uid, userData)           // Crear perfil en Firestore
- getUser(uid)                        // Obtener perfil por ID
- updateUser(uid, data)               // Actualizar perfil
- getDiscoverProfiles(currentUserId)  // Obtener perfiles para swipe
- searchUsers(query)                  // Buscar usuarios

// src/services/matchService.js
- recordSwipe(swiperId, swipedId, direction)  // Registrar swipe
- checkForMatch(user1Id, user2Id)             // Verificar si hay match
- createMatch(user1Id, user2Id)               // Crear match
- getMatches(userId)                          // Obtener matches del usuario
- deleteMatch(matchId)                        // Eliminar match

// src/services/chatService.js
- sendMessage(matchId, senderId, text)        // Enviar mensaje
- getMessages(matchId)                        // Obtener mensajes (listener)
- markAsRead(matchId, userId)                 // Marcar como leído
- getConversations(userId)                    // Obtener lista de chats
```

### 4. **Almacenamiento de imágenes**

Como Firebase Storage requiere plan Blaze, las imágenes se manejarán así:

```javascript
// Opción A: Guardar localmente + ruta en Firestore
photos: [
  "/storage/emulated/0/CrushUV/photo_0.jpg",
  "/storage/emulated/0/CrushUV/photo_1.jpg"
]

// Opción B: Convertir a Base64 y guardar en Firestore (máx 1MB por documento)
photos: [
  "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
]
```

### 5. **Funcionalidades a implementar**

| Pantalla | Funcionalidad | Firestore |
|----------|---------------|-----------|
| RegisterScreen | Crear cuenta | Auth + users |
| LoginScreen | Iniciar sesión | Auth |
| CreateProfileScreen | Guardar perfil | users |
| DiscoverScreen | Cargar perfiles, swipe | users, swipes, matches |
| MatchesScreen | Listar matches | matches, users |
| ChatListScreen | Listar conversaciones | matches, messages |
| ChatDetailScreen | Chat en tiempo real | messages (onSnapshot) |
| ProfileScreen | Ver mi perfil | users |
| EditProfileScreen | Editar perfil | users |

---

## 🔌 Implementación de Mensajería en Tiempo Real con Firestore

### ¿Por qué Firestore en lugar de WebSocket tradicional?

| WebSocket (Socket.IO) | Firestore Realtime |
|-----------------------|-------------------|
| Requiere servidor propio | Sin servidor (serverless) |
| Costos de hosting | Plan gratuito generoso |
| Manejo de conexiones | Automático |
| Reconexión manual | Automática |
| Escalabilidad manual | Escalable automáticamente |

### Arquitectura de mensajería con Firestore

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Usuario A  │────▶│ Firestore Cloud  │◀────│  Usuario B  │
│  (Sender)   │     │    Database      │     │  (Receiver) │
└─────────────┘     └──────────────────┘     └─────────────┘
      │                     │                       │
      │   sendMessage()     │    onSnapshot()       │
      │─────────────────────▶                       │
      │                     │───────────────────────▶
      │                     │   Mensaje en tiempo   │
      │                     │        real           │
```

### Implementación del servicio de chat

```javascript
// src/services/chatService.js
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const chatService = {
  /**
   * Enviar un mensaje
   * @param {string} matchId - ID del match/conversación
   * @param {string} text - Texto del mensaje
   */
  sendMessage: async (matchId, text) => {
    const user = auth().currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const messageData = {
      text,
      senderId: user.uid,
      senderName: user.displayName || 'Usuario',
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'text',
    };

    // Agregar mensaje a la subcolección
    await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .add(messageData);

    // Actualizar último mensaje en el match
    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        lastMessage: text,
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Suscribirse a mensajes en tiempo real
   * @param {string} matchId - ID del match/conversación
   * @param {function} onMessages - Callback cuando llegan mensajes
   * @returns {function} - Función para cancelar suscripción
   */
  subscribeToMessages: (matchId, onMessages) => {
    return firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .onSnapshot(
        snapshot => {
          const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }));
          onMessages(messages);
        },
        error => {
          console.error('Error escuchando mensajes:', error);
        }
      );
  },

  /**
   * Marcar mensajes como leídos
   * @param {string} matchId - ID del match
   * @param {string} currentUserId - ID del usuario actual
   */
  markAsRead: async (matchId, currentUserId) => {
    const unreadMessages = await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .where('senderId', '!=', currentUserId)
      .where('read', '==', false)
      .get();

    const batch = firestore().batch();
    unreadMessages.docs.forEach(doc => {
      batch.update(doc.ref, {read: true});
    });
    await batch.commit();
  },

  /**
   * Obtener conversaciones del usuario
   * @param {string} userId - ID del usuario
   * @param {function} onConversations - Callback con conversaciones
   * @returns {function} - Función para cancelar suscripción
   */
  subscribeToConversations: (userId, onConversations) => {
    return firestore()
      .collection('matches')
      .where('users', 'array-contains', userId)
      .where('isActive', '==', true)
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(
        async snapshot => {
          const conversations = await Promise.all(
            snapshot.docs.map(async doc => {
              const matchData = doc.data();
              const otherUserId = matchData.users.find(id => id !== userId);
              
              // Obtener datos del otro usuario
              const userDoc = await firestore()
                .collection('users')
                .doc(otherUserId)
                .get();
              
              return {
                id: doc.id,
                ...matchData,
                otherUser: userDoc.exists ? userDoc.data() : null,
              };
            })
          );
          onConversations(conversations);
        },
        error => {
          console.error('Error escuchando conversaciones:', error);
        }
      );
  },

  /**
   * Obtener conteo de mensajes no leídos
   * @param {string} matchId - ID del match
   * @param {string} currentUserId - ID del usuario actual
   * @returns {Promise<number>} - Número de mensajes no leídos
   */
  getUnreadCount: async (matchId, currentUserId) => {
    const snapshot = await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .where('senderId', '!=', currentUserId)
      .where('read', '==', false)
      .get();
    
    return snapshot.size;
  },

  /**
   * Enviar imagen (convertida a base64)
   * @param {string} matchId - ID del match
   * @param {string} imageBase64 - Imagen en formato base64
   */
  sendImage: async (matchId, imageBase64) => {
    const user = auth().currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const messageData = {
      text: '',
      image: imageBase64,
      senderId: user.uid,
      senderName: user.displayName || 'Usuario',
      createdAt: firestore.FieldValue.serverTimestamp(),
      read: false,
      type: 'image',
    };

    await firestore()
      .collection('messages')
      .doc(matchId)
      .collection('chat')
      .add(messageData);

    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        lastMessage: '📷 Imagen',
        lastMessageAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  /**
   * Indicador de "escribiendo..."
   * @param {string} matchId - ID del match
   * @param {boolean} isTyping - Si está escribiendo o no
   */
  setTypingStatus: async (matchId, isTyping) => {
    const user = auth().currentUser;
    if (!user) return;

    await firestore()
      .collection('matches')
      .doc(matchId)
      .update({
        [`typing.${user.uid}`]: isTyping,
      });
  },

  /**
   * Suscribirse al estado de "escribiendo"
   * @param {string} matchId - ID del match
   * @param {string} currentUserId - ID del usuario actual
   * @param {function} onTyping - Callback cuando el otro escribe
   * @returns {function} - Función para cancelar suscripción
   */
  subscribeToTyping: (matchId, currentUserId, onTyping) => {
    return firestore()
      .collection('matches')
      .doc(matchId)
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data?.typing) {
          const otherUserTyping = Object.entries(data.typing)
            .filter(([id, typing]) => id !== currentUserId && typing)
            .length > 0;
          onTyping(otherUserTyping);
        }
      });
  },
};

export default chatService;
```

### Uso en ChatDetailScreen

```javascript
// src/screens/chat/ChatDetailScreen.js
import React, {useState, useEffect, useCallback} from 'react';
import {View, FlatList, TextInput, TouchableOpacity, Text} from 'react-native';
import chatService from '../../services/chatService';
import auth from '@react-native-firebase/auth';

const ChatDetailScreen = ({route}) => {
  const {matchId, otherUser} = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    // Suscribirse a mensajes en tiempo real
    const unsubscribeMessages = chatService.subscribeToMessages(
      matchId,
      setMessages
    );

    // Suscribirse al indicador de "escribiendo"
    const unsubscribeTyping = chatService.subscribeToTyping(
      matchId,
      currentUserId,
      setIsOtherTyping
    );

    // Marcar mensajes como leídos
    chatService.markAsRead(matchId, currentUserId);

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      chatService.setTypingStatus(matchId, false);
    };
  }, [matchId, currentUserId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const text = inputText;
    setInputText('');
    chatService.setTypingStatus(matchId, false);
    
    try {
      await chatService.sendMessage(matchId, text);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    }
  };

  const handleTextChange = (text) => {
    setInputText(text);
    chatService.setTypingStatus(matchId, text.length > 0);
  };

  const renderMessage = ({item}) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {item.createdAt?.toLocaleTimeString?.() || ''}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
      />
      
      {isOtherTyping && (
        <Text style={styles.typingIndicator}>
          {otherUser.name} está escribiendo...
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={handleTextChange}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
```

### Uso en ChatListScreen

```javascript
// src/screens/chat/ChatListScreen.js
import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity, Text, Image} from 'react-native';
import chatService from '../../services/chatService';
import auth from '@react-native-firebase/auth';

const ChatListScreen = ({navigation}) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = auth().currentUser?.uid;

  useEffect(() => {
    const unsubscribe = chatService.subscribeToConversations(
      currentUserId,
      (convos) => {
        setConversations(convos);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  const renderConversation = ({item}) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate('ChatDetail', {
        matchId: item.id,
        otherUser: item.otherUser,
      })}
    >
      <Image
        source={{uri: item.otherUser?.photos?.[0] || 'default_avatar'}}
        style={styles.avatar}
      />
      <View style={styles.conversationInfo}>
        <Text style={styles.name}>{item.otherUser?.name || 'Usuario'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage || 'Sin mensajes aún'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tienes conversaciones aún
          </Text>
        }
      />
    </View>
  );
};
```

---

## Reglas de seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuarios: solo el dueño puede escribir, todos pueden leer
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Matches: solo participantes pueden leer/escribir
    match /matches/{matchId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.users;
    }
    
    // Mensajes: solo participantes del match
    match /messages/{matchId}/chat/{messageId} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/matches/$(matchId)) &&
        request.auth.uid in get(/databases/$(database)/documents/matches/$(matchId)).data.users;
    }
    
    // Swipes: solo el que hace swipe puede escribir
    match /swipes/{swipeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.swiperId;
    }
  }
}
```

---

## AuthContext actualizado

```javascript
// src/context/AuthContext.js
- user: objeto del usuario autenticado
- profile: datos del perfil desde Firestore
- isAuthenticated: boolean
- isProfileComplete: boolean
- login(email, password)
- register(email, password)
- logout()
- updateProfile(data)
```

---

## Dependencias instaladas

```json
{
  "@react-native-firebase/app": "^23.5.0",
  "@react-native-firebase/auth": "^23.5.0",
  "@react-native-firebase/firestore": "^23.5.0",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "react-native-image-picker": "^8.2.1",
  "react-native-fs": "^2.20.0"
}
```

---

## Instrucción final

Implementa todas las funcionalidades descritas arriba para que la aplicación CrushUV funcione completamente con Firebase Firestore. Elimina todos los datos hardcodeados y reemplázalos con consultas a Firestore. Implementa listeners en tiempo real para el chat usando `onSnapshot()` de Firestore (reemplazando la necesidad de WebSockets tradicionales). Las imágenes de perfil deben guardarse localmente en el dispositivo y sus rutas almacenarse en Firestore.

---

## Resumen de cambios WebSocket → Firestore

| Antes (WebSocket) | Ahora (Firestore) |
|-------------------|-------------------|
| `socket.emit('message', data)` | `chatService.sendMessage(matchId, text)` |
| `socket.on('message', callback)` | `chatService.subscribeToMessages(matchId, callback)` |
| `socket.emit('typing', true)` | `chatService.setTypingStatus(matchId, true)` |
| `socket.on('typing', callback)` | `chatService.subscribeToTyping(matchId, callback)` |
| Servidor Node.js requerido | Sin servidor (serverless) |
| Reconexión manual | Automática |
