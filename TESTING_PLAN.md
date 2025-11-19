# 🧪 Plan de Pruebas - Chat en Tiempo Real

## 📋 Resumen

Este documento describe el plan de pruebas para la funcionalidad de chat en tiempo real implementada con WebSocket (Socket.IO) en CrushUV.

## 🎯 Objetivos de Prueba

1. Verificar que los mensajes se envían y reciben en tiempo real
2. Validar los indicadores de escritura
3. Comprobar el estado online/offline
4. Probar la reconexión automática
5. Verificar el comportamiento en diferentes escenarios

## 🛠️ Configuración de Entorno de Pruebas

### Requisitos
- Node.js instalado (v16+)
- React Native CLI configurado
- Dos o más dispositivos/simuladores para pruebas multi-usuario
- Servidor Socket.IO corriendo

### Pasos de Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de ejemplo**:
   ```bash
   node example-server.js
   ```
   
   Deberías ver:
   ```
   🚀 CrushUV Chat Server is running!
   📡 WebSocket Server: http://localhost:3000
   ```

3. **Ejecutar la aplicación** (en múltiples dispositivos):
   
   Dispositivo 1:
   ```bash
   npm run ios
   # o
   npm run android
   ```
   
   Dispositivo 2 (simulador adicional):
   ```bash
   # iOS: Abre otro simulador desde Xcode
   # Android: Abre otro emulador desde Android Studio
   ```

## 📝 Casos de Prueba

### 1. Conexión al Servidor

**Objetivo**: Verificar que la app se conecta correctamente al servidor WebSocket

**Pasos**:
1. Abrir la app
2. Navegar a la pantalla de Chat
3. Observar el header

**Resultado Esperado**:
- ✅ No debe aparecer el ícono de "cloud-offline"
- ✅ En los logs del servidor debe aparecer: "New user connected"
- ✅ Los usuarios deben aparecer como "online" (punto verde)

**Logs del servidor**:
```
🔗 New user connected: [socket-id]
👤 User authenticated: user_123
```

---

### 2. Envío de Mensaje Simple

**Objetivo**: Verificar el envío básico de mensajes

**Pasos**:
1. En Dispositivo 1: Abrir una conversación
2. Escribir "Hola, ¿cómo estás?" en el input
3. Presionar el botón de enviar

**Resultado Esperado**:
- ✅ El mensaje aparece inmediatamente en Dispositivo 1 (optimistic update)
- ✅ El mensaje aparece con el timestamp correcto
- ✅ El mensaje se muestra en una burbuja azul (del lado derecho)

**Logs del servidor**:
```
💬 Message received: {conversationId, text, senderId...}
✅ Message sent to conversation: conv_1
```

---

### 3. Recepción de Mensaje en Tiempo Real

**Objetivo**: Verificar que los mensajes se reciben instantáneamente

**Prerequisito**: Caso de prueba #2 completado

**Pasos**:
1. En Dispositivo 2: Estar en la misma conversación
2. Observar la pantalla sin hacer nada

**Resultado Esperado**:
- ✅ El mensaje "Hola, ¿cómo estás?" aparece automáticamente
- ✅ El mensaje se muestra en una burbuja gris (del lado izquierdo)
- ✅ Aparece el avatar del remitente junto al mensaje
- ✅ La lista se desplaza automáticamente hacia abajo

---

### 4. Indicador de "Escribiendo..."

**Objetivo**: Verificar que el indicador de escritura funciona

**Pasos**:
1. En Dispositivo 1: Empezar a escribir un mensaje (no enviar)
2. En Dispositivo 2: Observar el header de la conversación

**Resultado Esperado**:
- ✅ En Dispositivo 2 debe aparecer "Escribiendo..." bajo el nombre
- ✅ Después de 2 segundos sin escribir, "Escribiendo..." desaparece
- ✅ Vuelve a "En línea" o "Desconectado" según el estado

**Logs del servidor**:
```
⌨️  User user_123 is typing in conv_1
⌨️  User user_123 is stopped typing in conv_1
```

---

### 5. Estado Online/Offline

**Objetivo**: Verificar la detección de estado de conexión

**Pasos**:
1. Dispositivo 1: Abrir ChatListScreen
2. Observar los avatares de los contactos
3. Cerrar la app en Dispositivo 2
4. En Dispositivo 1: Observar los cambios

**Resultado Esperado**:
- ✅ Inicialmente, los usuarios activos tienen punto verde
- ✅ Al cerrar Dispositivo 2, el punto verde desaparece
- ✅ El estado cambia de "En línea" a "Desconectado"
- ✅ Los badges de unread no se afectan

**Logs del servidor**:
```
🔌 User disconnected: [socket-id]
👋 User signed off: user_456
```

---

### 6. Múltiples Mensajes Rápidos

**Objetivo**: Probar el rendimiento con múltiples mensajes

**Pasos**:
1. En Dispositivo 1: Enviar 10 mensajes consecutivos rápidamente
2. En Dispositivo 2: Observar la recepción

**Resultado Esperado**:
- ✅ Todos los mensajes se envían correctamente
- ✅ Todos los mensajes se reciben en orden
- ✅ No hay mensajes duplicados
- ✅ No hay pérdida de mensajes
- ✅ Los timestamps son correctos

---

### 7. Reconexión Automática

**Objetivo**: Verificar que la app se reconecta automáticamente

**Pasos**:
1. Con la app abierta, detener el servidor: `Ctrl+C` en la terminal del servidor
2. Observar el indicador de conexión en la app
3. Reiniciar el servidor: `node example-server.js`
4. Esperar 5 segundos

**Resultado Esperado**:
- ✅ Al detener el servidor, aparece ícono de "cloud-offline" en rojo
- ✅ Al reiniciar el servidor, la app se reconecta automáticamente
- ✅ El ícono de "cloud-offline" desaparece
- ✅ Los mensajes se pueden enviar nuevamente

**Logs del servidor**:
```
🔗 New user connected: [socket-id]
👤 User authenticated: user_123
```

---

### 8. Cambio de Conversación

**Objetivo**: Verificar el comportamiento al cambiar de chat

**Pasos**:
1. Abrir conversación con "Ana María"
2. Enviar un mensaje
3. Volver a ChatListScreen
4. Abrir conversación con "Carlos"
5. Enviar un mensaje

**Resultado Esperado**:
- ✅ El mensaje en conversación 1 se guarda
- ✅ Al abrir conversación 2, se cargan los mensajes correctos
- ✅ Los mensajes no se mezclan entre conversaciones
- ✅ Los indicadores se actualizan correctamente

**Logs del servidor**:
```
📤 User user_123 left conversation: conv_1
📥 User user_123 joined conversation: conv_2
```

---

### 9. Sincronización de LastMessage

**Objetivo**: Verificar que el último mensaje se actualiza en la lista

**Pasos**:
1. En Dispositivo 1: Estar en ChatListScreen
2. En Dispositivo 2: Enviar un mensaje en una conversación
3. En Dispositivo 1: Observar ChatListScreen

**Resultado Esperado**:
- ✅ El último mensaje se actualiza automáticamente
- ✅ El timestamp cambia a "Ahora"
- ✅ El badge de unread aumenta
- ✅ La conversación puede moverse al tope (si está ordenada por actividad)

---

### 10. Mensajes con Caracteres Especiales

**Objetivo**: Verificar el manejo de diferentes tipos de contenido

**Pasos**:
1. Enviar mensajes con:
   - Emojis: "¡Hola! 😊👋🎉"
   - Caracteres especiales: "@#$%&*"
   - Texto largo (más de 200 caracteres)
   - Múltiples líneas (con Enter)

**Resultado Esperado**:
- ✅ Todos los caracteres se muestran correctamente
- ✅ Los emojis se renderizan bien
- ✅ Los mensajes largos se ajustan en múltiples líneas
- ✅ Los saltos de línea se respetan

---

## 🐛 Casos de Error a Probar

### Error 1: Servidor No Disponible

**Escenario**: Intentar usar la app sin servidor corriendo

**Pasos**:
1. Asegurarse de que el servidor NO esté corriendo
2. Abrir la app
3. Intentar enviar un mensaje

**Resultado Esperado**:
- ✅ Aparece ícono de "cloud-offline"
- ✅ Los usuarios aparecen como offline
- ✅ Los mensajes no se envían pero permanecen en el input
- ✅ En consola: "Socket not connected"

---

### Error 2: Pérdida de Conexión Durante Conversación

**Escenario**: Conexión se pierde mientras se chatea

**Pasos**:
1. Estar en una conversación activa
2. Desconectar WiFi/red del dispositivo
3. Intentar enviar un mensaje
4. Reconectar red

**Resultado Esperado**:
- ✅ Aparece indicador de desconexión
- ✅ Mensaje permanece en el input
- ✅ Al reconectar, el ícono desaparece
- ✅ Se puede enviar el mensaje

---

### Error 3: Conversación Inexistente

**Escenario**: Intentar unirse a una conversación que no existe

**Pasos**:
1. Modificar temporalmente el conversationId a uno inválido
2. Intentar enviar un mensaje

**Resultado Esperado**:
- ✅ No debe causar crash
- ✅ Debe crear la conversación automáticamente o mostrar error

---

## 📊 Métricas de Rendimiento

### Latencia de Mensajes
- **Objetivo**: < 500ms entre envío y recepción
- **Medición**: Usar timestamp para calcular diferencia

### Reconexión
- **Objetivo**: < 5 segundos para reconectar
- **Medición**: Tiempo entre pérdida y recuperación de conexión

### Memoria
- **Objetivo**: < 100MB de uso de memoria adicional
- **Medición**: Usar herramientas de profiling de React Native

## ✅ Checklist Final

Antes de considerar la implementación completa, verificar:

- [ ] Todos los casos de prueba pasan
- [ ] No hay errores en consola
- [ ] Los logs del servidor son claros
- [ ] La app no se congela en ningún momento
- [ ] Los mensajes se sincronizan correctamente
- [ ] La reconexión funciona sin problemas
- [ ] Los indicadores visuales son claros
- [ ] La experiencia de usuario es fluida
- [ ] No hay pérdida de mensajes
- [ ] El rendimiento es aceptable

## 🚨 Problemas Conocidos

*(Documentar aquí cualquier problema encontrado durante las pruebas)*

## 📝 Notas

- Para probar con usuarios reales, se necesita un servidor en la nube
- Los logs del servidor son esenciales para debugging
- Probar en diferentes condiciones de red (WiFi, 4G, 3G)
- Verificar comportamiento en background/foreground

## 🔗 Referencias

- [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md) - Documentación técnica
- [example-server.js](example-server.js) - Servidor de pruebas
- [Socket.IO Documentation](https://socket.io/docs/v4/)

---

<div align="center">
  <p><strong>Desarrollado con ❤️ para Universidad del Valle</strong></p>
  <p>© 2025 CrushUV</p>
</div>
