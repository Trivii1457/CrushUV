# 💬 Implementación de Chat en Tiempo Real con WebSocket

## 📋 Descripción General

Este documento describe la implementación de la funcionalidad de chat en tiempo real utilizando Socket.IO (WebSocket) en la aplicación CrushUV.

## 🔧 Tecnología Utilizada

- **Socket.IO Client** (v4.x): Librería para conexión WebSocket con fallback automático a HTTP long-polling
- **React Context API**: Para gestión de estado global del chat
- **React Hooks**: Para manejo de efectos secundarios y estado local

## 📁 Estructura de Archivos

```
src/
├── services/
│   └── socketService.js        # Servicio singleton para conexión WebSocket
├── context/
│   └── ChatContext.js          # Context provider para estado del chat
└── screens/
    └── chat/
        ├── ChatListScreen.js   # Lista de conversaciones (actualizada)
        └── ChatDetailScreen.js # Conversación individual (actualizada)
```

## 🔌 Servicio de WebSocket (socketService.js)

### Funcionalidades

- **Conexión automática**: Establece conexión con el servidor Socket.IO
- **Reconexión automática**: Intenta reconectar si se pierde la conexión
- **Gestión de salas**: Join/leave de conversaciones específicas
- **Envío de mensajes**: Emite mensajes a través del socket
- **Indicador de escritura**: Notifica cuando un usuario está escribiendo
- **Estado online**: Detecta cuando usuarios están en línea

### Configuración

```javascript
const SOCKET_URL = 'http://localhost:3000';
```

**Importante**: En producción, debes cambiar esta URL por la de tu servidor backend.

### Métodos Principales

#### `connect(userId)`
Establece la conexión con el servidor Socket.IO.

```javascript
socketService.connect('user_123');
```

#### `disconnect()`
Cierra la conexión con el servidor.

```javascript
socketService.disconnect();
```

#### `sendMessage(messageData)`
Envía un mensaje a través del socket.

```javascript
socketService.sendMessage({
  conversationId: 'conv_1',
  text: 'Hola!',
  senderId: 'user_123',
  recipientId: 'user_456',
  timestamp: '10:30'
});
```

#### `joinConversation(conversationId)`
Unirse a una sala de conversación específica.

```javascript
socketService.joinConversation('conv_1');
```

#### `leaveConversation(conversationId)`
Salir de una sala de conversación.

```javascript
socketService.leaveConversation('conv_1');
```

#### `onNewMessage(callback)`
Escuchar mensajes entrantes.

```javascript
socketService.onNewMessage((message) => {
  console.log('Nuevo mensaje:', message);
});
```

#### `sendTypingStatus(conversationId, isTyping)`
Enviar indicador de escritura.

```javascript
socketService.sendTypingStatus('conv_1', true);
```

## 🌐 Context de Chat (ChatContext.js)

### Provider

El `ChatProvider` envuelve la aplicación y proporciona acceso al estado del chat en todos los componentes.

```javascript
<ChatProvider>
  <App />
</ChatProvider>
```

### Hook useChat()

Hook personalizado para acceder al contexto del chat.

```javascript
const {
  conversations,      // Lista de conversaciones
  messages,           // Mensajes por conversación
  isConnected,        // Estado de conexión
  currentUserId,      // ID del usuario actual
  typingUsers,        // Usuarios escribiendo
  onlineUsers,        // Usuarios en línea
  sendMessage,        // Función para enviar mensajes
  joinConversation,   // Función para unirse a conversación
  leaveConversation,  // Función para salir de conversación
  setTypingStatus,    // Función para establecer estado de escritura
  markConversationAsRead, // Función para marcar como leído
  getConversationMessages, // Función para obtener mensajes
} = useChat();
```

### Ejemplo de Uso

```javascript
import {useChat} from '../../context/ChatContext';

function ChatScreen() {
  const {sendMessage, conversations, isConnected} = useChat();
  
  const handleSend = (text) => {
    sendMessage('conv_1', text, 'recipient_id');
  };
  
  return (
    <View>
      {!isConnected && <Text>Desconectado</Text>}
      {/* Resto del componente */}
    </View>
  );
}
```

## 📱 Pantallas Actualizadas

### ChatListScreen

**Características añadidas:**
- Muestra lista de conversaciones desde el contexto
- Indicador de conexión en el header
- Indicador de estado online en cada avatar
- Badge de mensajes no leídos
- Actualización automática cuando llegan nuevos mensajes

### ChatDetailScreen

**Características añadidas:**
- Envío de mensajes en tiempo real
- Recepción automática de mensajes
- Indicador de "escribiendo..."
- Indicador de estado online del contacto
- Indicador de conexión en el header
- Auto-scroll al recibir nuevos mensajes
- Notificación de estado de escritura al servidor

## 🔄 Flujo de Mensajes

### Envío de Mensaje

1. Usuario escribe mensaje en `ChatDetailScreen`
2. Al presionar "Enviar", se llama `sendMessage()` del contexto
3. El mensaje se añade optimísticamente al estado local
4. Se emite el mensaje a través del socket
5. El servidor recibe y procesa el mensaje
6. El servidor reenvía el mensaje al destinatario

### Recepción de Mensaje

1. Servidor emite evento `new_message`
2. `socketService` recibe el evento
3. `ChatContext` actualiza el estado con el nuevo mensaje
4. Los componentes se re-renderizan automáticamente
5. El usuario ve el nuevo mensaje instantáneamente

## 🎨 Características Visuales

### Indicadores de Estado

- **Punto verde**: Usuario en línea
- **Icono de nube offline**: Sin conexión a internet
- **"Escribiendo..."**: El otro usuario está escribiendo
- **Badge rojo**: Mensajes no leídos

### Animaciones

- Auto-scroll al recibir mensajes
- Transiciones suaves en la UI
- Feedback visual inmediato al enviar

## ⚙️ Configuración del Backend

Para que el chat funcione completamente, necesitas un servidor Socket.IO. Ejemplo básico:

```javascript
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  
  // Usuario se une a una conversación
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Usuario ${socket.id} se unió a ${conversationId}`);
  });
  
  // Usuario sale de una conversación
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`Usuario ${socket.id} salió de ${conversationId}`);
  });
  
  // Enviar mensaje
  socket.on('send_message', (messageData) => {
    // Guardar mensaje en base de datos
    // ...
    
    // Reenviar mensaje a todos en la conversación
    io.to(messageData.conversationId).emit('new_message', messageData);
  });
  
  // Estado de escritura
  socket.on('typing', ({conversationId, isTyping}) => {
    socket.to(conversationId).emit('user_typing', {
      conversationId,
      userId: socket.id,
      isTyping
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
```

### Instalación del Servidor

```bash
npm install express socket.io
node server.js
```

## 🔐 Seguridad

### Autenticación

El servicio incluye autenticación básica a través del campo `auth` en la configuración de Socket.IO:

```javascript
auth: {
  userId: userId,
}
```

En producción, deberías usar un token JWT:

```javascript
auth: {
  token: 'jwt_token_here',
}
```

### Validación en el Servidor

```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (isValidToken(token)) {
    next();
  } else {
    next(new Error('Authentication error'));
  }
});
```

## 🚀 Despliegue

### URL de Producción

Actualiza la URL en `socketService.js`:

```javascript
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'https://api.crushuv.com';
```

### Variables de Entorno

Crea un archivo `.env`:

```
REACT_APP_SOCKET_URL=https://api.crushuv.com
```

## 📊 Mejoras Futuras

- [ ] Persistencia de mensajes en base de datos
- [ ] Historial de mensajes con paginación
- [ ] Notificaciones push para mensajes
- [ ] Confirmación de lectura (checks azules)
- [ ] Compartir imágenes y archivos
- [ ] Mensajes de voz
- [ ] Videollamadas
- [ ] Cifrado end-to-end
- [ ] Grupos de chat
- [ ] Mensajes temporales (Snapchat style)

## 🐛 Solución de Problemas

### El socket no se conecta

1. Verifica que el servidor esté corriendo
2. Revisa la URL en `SOCKET_URL`
3. Verifica los CORS en el servidor
4. Revisa la consola para errores de conexión

### Los mensajes no se envían

1. Verifica que `isConnected` sea `true`
2. Revisa la estructura del mensaje
3. Verifica que el evento esté implementado en el servidor
4. Revisa los logs del servidor

### Los mensajes no se reciben

1. Verifica que el listener esté configurado
2. Verifica que estés unido a la conversación correcta
3. Revisa que el servidor esté emitiendo correctamente
4. Verifica que el evento se llame igual en cliente y servidor

## 📚 Recursos Adicionales

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [React Context API](https://react.dev/reference/react/useContext)
- [React Native WebSocket](https://reactnative.dev/docs/network#websocket-support)

## 👥 Soporte

Para preguntas o problemas, contacta a:
- **Email**: crushuv@correounivalle.edu.co
- **GitHub Issues**: [CrushUV Issues](https://github.com/Trivii1457/CrushUV/issues)

---

<div align="center">
  <p><strong>Desarrollado con ❤️ para Universidad del Valle</strong></p>
  <p>© 2025 CrushUV</p>
</div>
