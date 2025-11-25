# 💬 Chat en Tiempo Real - Guía Rápida

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Iniciar Servidor de Chat

```bash
node example-server.js
```

Verás algo como:
```
╔════════════════════════════════════════════════════════════╗
║   🚀 CrushUV Chat Server is running!                      ║
║   📡 WebSocket Server: http://localhost:3000              ║
╚════════════════════════════════════════════════════════════╝
```

### 3. Ejecutar la App

**iOS:**
```bash
cd ios && pod install && cd ..
npm run ios
```

**Android:**
```bash
npm run android
```

### 4. ¡Probar el Chat!

1. Abre la app en múltiples dispositivos/simuladores
2. Navega a la sección de Chat
3. Envía mensajes entre dispositivos
4. ¡Deberías ver los mensajes aparecer en tiempo real! 🎉

## 📱 Características Implementadas

- ✅ **Mensajería en Tiempo Real**: Los mensajes llegan instantáneamente
- ✅ **Indicador de Escritura**: Ve cuando alguien está escribiendo
- ✅ **Estado Online/Offline**: Sabe quién está conectado
- ✅ **Reconexión Automática**: Se reconecta si pierdes la conexión
- ✅ **Badges de No Leídos**: Contador de mensajes pendientes
- ✅ **Optimistic Updates**: Feedback instantáneo al enviar

## 🎨 Indicadores Visuales

| Indicador | Significado |
|-----------|-------------|
| 🟢 Punto verde en avatar | Usuario en línea |
| ☁️ Ícono de nube tachada | Sin conexión |
| "Escribiendo..." | El otro usuario está escribiendo |
| Badge rojo con número | Mensajes no leídos |
| Timestamp "Ahora" | Mensaje recién recibido |

## 🛠️ Estructura de Archivos

```
src/
├── services/
│   └── socketService.js        # Conexión WebSocket
├── context/
│   └── ChatContext.js          # Estado global del chat
├── screens/
│   └── chat/
│       ├── ChatListScreen.js   # Lista de conversaciones
│       └── ChatDetailScreen.js # Conversación individual
└── App.js                      # Provider configurado
```

## 🔧 Configuración

### Cambiar URL del Servidor

Edita `src/services/socketService.js`:

```javascript
const SOCKET_URL = 'http://localhost:3000'; // Desarrollo
// const SOCKET_URL = 'https://tu-servidor.com'; // Producción
```

### Variables de Entorno (Opcional)

Crea `.env`:
```
REACT_APP_SOCKET_URL=http://localhost:3000
```

Actualiza `socketService.js`:
```javascript
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';
```

## 🐛 Solución de Problemas

### El chat no se conecta

1. ✅ Verifica que el servidor esté corriendo: `node example-server.js`
2. ✅ Revisa la URL en `socketService.js`
3. ✅ Mira los logs del servidor para ver conexiones
4. ✅ Verifica que no haya ícono de nube tachada en la app

### Los mensajes no se envían

1. ✅ Verifica la conexión (no debe haber ícono de nube)
2. ✅ Revisa los logs del servidor
3. ✅ Comprueba que el conversationId sea correcto
4. ✅ Intenta reconectar (cierra y abre la app)

### Los mensajes no se reciben

1. ✅ Verifica que ambos dispositivos estén conectados
2. ✅ Comprueba que estén en la misma conversación
3. ✅ Revisa los logs del servidor para ver si el mensaje se emitió
4. ✅ Intenta enviar otro mensaje

## 📚 Documentación Completa

- [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md) - Guía técnica completa
- [TESTING_PLAN.md](TESTING_PLAN.md) - Plan de pruebas detallado
- [example-server.js](example-server.js) - Código del servidor

## 💡 Tips para Desarrollo

### Ver Logs del Servidor

```bash
node example-server.js
```

Verás en tiempo real:
- 🔗 Conexiones de usuarios
- 💬 Mensajes enviados
- ⌨️ Estados de escritura
- 🔌 Desconexiones

### Probar con Múltiples Usuarios

**iOS:**
```bash
# Terminal 1
xcrun simctl boot "iPhone 14"
npm run ios

# Terminal 2
xcrun simctl boot "iPhone 14 Pro"
react-native run-ios --simulator="iPhone 14 Pro"
```

**Android:**
```bash
# Abre varios emuladores desde Android Studio
# o usa dispositivos físicos
```

### Debugging

Activa logs en `socketService.js`:
```javascript
this.socket.on('connect', () => {
  console.log('✅ Connected:', this.socket.id);
});

this.socket.on('new_message', (message) => {
  console.log('📨 New message:', message);
});
```

## 🎯 Próximos Pasos

1. **Deploy del Servidor**: Sube el servidor a Heroku, AWS, o DigitalOcean
2. **Base de Datos**: Integra MongoDB/PostgreSQL para persistir mensajes
3. **Autenticación**: Añade JWT para seguridad
4. **Notificaciones Push**: Implementa FCM para notificaciones
5. **Imágenes**: Permite compartir fotos en el chat
6. **Mensajes de Voz**: Añade soporte para audio

## 🤝 Soporte

¿Problemas? ¿Preguntas?

1. Revisa [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md)
2. Consulta [TESTING_PLAN.md](TESTING_PLAN.md)
3. Abre un [Issue en GitHub](https://github.com/Trivii1457/CrushUV/issues)
4. Contacta: crushuv@correounivalle.edu.co

## 📄 Licencia

MIT License - Universidad del Valle

---

<div align="center">
  <p><strong>¡Feliz coding! 💻✨</strong></p>
  <p>Hecho con ❤️ para la comunidad Univalluna</p>
</div>
