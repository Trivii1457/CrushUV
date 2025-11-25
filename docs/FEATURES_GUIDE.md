# 📱 CrushUV - Guía Visual de Características

## 🎨 Pantallas Implementadas

### 1. Autenticación

#### 🔐 Login Screen (Pantalla de Inicio de Sesión)
**Ubicación**: `src/screens/auth/LoginScreen.js`

**Características**:
- Header con gradiente y logo de corazón
- Formulario de login con correo institucional
- Campo de contraseña con validación
- Botón "Olvidaste tu contraseña"
- Enlace para registro
- Validación de correo @correounivalle.edu.co

**Elementos visuales**:
- Gradiente rosa-rojo (#FF4458 → #FE3C72)
- Iconos de Ionicons para inputs
- Botón con gradiente
- Diseño responsive

---

#### 📝 Register Screen (Pantalla de Registro)
**Ubicación**: `src/screens/auth/RegisterScreen.js`

**Características**:
- Formulario completo de registro
- Campos: nombre, correo, contraseña, confirmación
- Checkbox de términos y condiciones
- Validación en tiempo real
- Botón de registro deshabilitado hasta aceptar términos

**Flujo**:
1. Usuario ingresa información
2. Acepta términos y condiciones
3. Presiona "Registrarse"
4. Navega a verificación de email

---

#### ✉️ Email Verification Screen (Verificación de Email)
**Ubicación**: `src/screens/auth/EmailVerificationScreen.js`

**Características**:
- Icono de correo grande
- Mensaje de instrucciones
- Botón para reenviar código
- Link para volver al login
- Estado de "Enviando..." durante reenvío

**Funcionalidad**:
- Simula envío de correo de verificación
- Permite continuar al completar perfil

---

### 2. Perfil de Usuario

#### 👤 Create Profile Screen (Crear Perfil)
**Ubicación**: `src/screens/profile/CreateProfileScreen.js`

**Características**:
- Grid de 6 espacios para fotos (mínimo 2)
- Información académica: carrera y semestre
- Fecha de nacimiento
- Biografía (campo de texto multilínea)
- Validación de campos requeridos

**Elementos visuales**:
- Grid 3x2 para fotos
- Placeholders con icono de "+"
- Inputs con iconos académicos
- Preview de fotos subidas

---

#### ✏️ Edit Profile Screen (Editar Perfil)
**Ubicación**: `src/screens/profile/EditProfileScreen.js`

**Características**:
- Gestión de fotos: añadir/eliminar
- Edición de información académica
- Actualización de biografía
- Gestión de intereses (tags)
- Botón "Guardar Cambios"

**Interacciones**:
- Tap para añadir foto
- Botón X en cada foto para eliminar
- Añadir/quitar intereses
- Validación antes de guardar

---

#### 👁️ Profile Screen (Ver Perfil)
**Ubicación**: `src/screens/profile/ProfileScreen.js`

**Características**:
- Foto principal en pantalla completa
- Estadísticas: Matches, Me gusta, Super Likes
- Biografía completa
- Lista de intereses con tags
- Grid de fotos adicionales
- Botones: Editar y Configuración

**Diseño**:
- Gradiente overlay en foto principal
- Cards con sombras
- Iconos informativos
- Layout responsive

---

### 3. Descubrimiento

#### 🔥 Discover Screen (Pantalla Principal)
**Ubicación**: `src/screens/discover/DiscoverScreen.js`

**Características**:
- Sistema de swipe cards (deslizamiento)
- Información del perfil sobre la foto
- Indicadores de "Like" y "Nope" al deslizar
- Botones de acción: ✗ (Nope), ★ (Super Like), ♥ (Like)
- Preview de siguiente carta
- Estado vacío cuando no hay más perfiles

**Animaciones**:
- Rotación al deslizar
- Fade in/out de stamps
- Transición entre cartas
- Gestos táctiles nativos

**Interacciones**:
- Deslizar derecha = Like
- Deslizar izquierda = Nope
- Deslizar arriba = Super Like
- Tap en botones para misma acción

---

### 4. Matches

#### 💝 Matches Screen (Lista de Matches)
**Ubicación**: `src/screens/matches/MatchesScreen.js`

**Características**:
- Grid de 2 columnas
- Foto y nombre de cada match
- Badge "NUEVO" para matches recientes
- Edad visible
- Búsqueda de matches
- Estado vacío con mensaje motivacional

**Elementos**:
- Cards con sombras
- Fotos redondeadas
- Badge en esquina superior
- Tap para abrir chat

---

### 5. Chat

#### 💬 Chat List Screen (Lista de Conversaciones)
**Ubicación**: `src/screens/chat/ChatListScreen.js`

**Características**:
- Lista de conversaciones activas
- Avatar con indicador de estado online
- Último mensaje visible
- Timestamp de último mensaje
- Badge de mensajes no leídos
- Búsqueda de conversaciones

**Elementos visuales**:
- Avatar circular (60px)
- Punto verde para "online"
- Badge rojo con contador
- Separadores sutiles
- Estado vacío informativo

---

#### 💌 Chat Detail Screen (Conversación)
**Ubicación**: `src/screens/chat/ChatDetailScreen.js`

**Características**:
- Burbujas de mensajes (estilo WhatsApp)
- Mensajes propios: gradiente rosa a la derecha
- Mensajes ajenos: gris a la izquierda
- Avatar en mensajes ajenos
- Timestamp en cada mensaje
- Input con botón de enviar
- Botón para adjuntar archivos
- Botones de videollamada y opciones

**Diseño**:
- Burbujas redondeadas
- Diferentes colores por remitente
- Input expandible
- Keyboard aware

---

### 6. Configuración

#### ⚙️ Settings Screen (Configuración)
**Ubicación**: `src/screens/settings/SettingsScreen.js`

**Características**:

**Sección Cuenta**:
- Editar perfil
- Cambiar contraseña
- Verificación de identidad

**Sección Privacidad**:
- Toggle: Notificaciones
- Toggle: Mostrar estado online
- Toggle: Mostrar distancia
- Cuenta privada

**Sección Preferencias**:
- Filtros (carrera, semestre, edad)
- Distancia máxima

**Sección General**:
- Ayuda y soporte
- Términos y condiciones
- Política de privacidad
- Acerca de (versión)

**Acciones Críticas**:
- Cerrar sesión (rojo)
- Eliminar cuenta (texto subrayado)

---

## 🎨 Sistema de Diseño

### Colores
```javascript
primary: '#FF4458'        // Rosa-rojo principal
secondary: '#FE3C72'      // Rosa intenso
accent: '#FF6B6B'         // Coral
background: '#FFFFFF'     // Blanco
surface: '#F8F8F8'        // Gris muy claro
text: '#424242'           // Gris oscuro
textLight: '#9E9E9E'      // Gris claro
success: '#4CAF50'        // Verde
error: '#F44336'          // Rojo
warning: '#FFC107'        // Amarillo
```

### Espaciado
```javascript
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

### Tipografía
```javascript
xs: 12px
sm: 14px
md: 16px
lg: 18px
xl: 24px
xxl: 32px
xxxl: 40px
```

### Bordes Redondeados
```javascript
sm: 4px
md: 8px
lg: 16px
xl: 24px
round: 50px
```

---

## 📦 Componentes Reutilizables

### Button Component
**Ubicación**: `src/components/Button.js`

**Props**:
- `title`: Texto del botón
- `onPress`: Función al presionar
- `variant`: 'primary' | 'secondary' | 'outline'
- `size`: 'small' | 'medium' | 'large'
- `loading`: Muestra spinner
- `disabled`: Deshabilita el botón

**Variantes**:
- **Primary**: Gradiente rosa-rojo
- **Secondary**: Blanco con borde rosa
- **Outline**: Transparente con borde gris

---

### Input Component
**Ubicación**: `src/components/Input.js`

**Props**:
- `label`: Etiqueta superior
- `value`: Valor del input
- `onChangeText`: Callback de cambio
- `placeholder`: Texto placeholder
- `secureTextEntry`: Para contraseñas
- `iconName`: Nombre del icono (Ionicons)
- `error`: Mensaje de error
- `multiline`: Para textos largos
- `keyboardType`: Tipo de teclado

**Características**:
- Icono izquierdo opcional
- Validación con mensaje de error
- Borde rojo en error
- Soporte multilinea

---

### ProfileCard Component
**Ubicación**: `src/components/ProfileCard.js`

**Props**:
- `profile`: Objeto con datos del perfil
  - `name`: Nombre
  - `age`: Edad
  - `career`: Carrera
  - `semester`: Semestre
  - `bio`: Biografía
  - `photos`: Array de URLs
  - `distance`: Distancia en km

**Características**:
- Foto en pantalla completa
- Gradiente overlay inferior
- Información sobre la imagen
- Tag de distancia
- Diseño responsive

---

## 🔄 Navegación

### Stack Navigator (Principal)
- Login → Register → EmailVerification → CreateProfile
- MainTabs ↔ ChatDetail
- MainTabs ↔ EditProfile
- MainTabs ↔ Settings

### Tab Navigator (MainTabs)
1. **Discover** (🔥): Pantalla de swipe
2. **Matches** (♥): Lista de matches
3. **Chat** (💬): Conversaciones
4. **Profile** (👤): Perfil propio

---

## 📱 Flujos de Usuario

### Flujo de Registro Completo
```
Login → "Regístrate"
  ↓
Register → Completa formulario
  ↓
EmailVerification → Verifica correo
  ↓
CreateProfile → Añade fotos e info
  ↓
MainTabs (Discover)
```

### Flujo de Match y Chat
```
Discover → Swipe Right (Like)
  ↓
Match! (Ambos dieron like)
  ↓
Matches → Ver en lista
  ↓
ChatList → Nueva conversación
  ↓
ChatDetail → Chatear
```

### Flujo de Edición de Perfil
```
Profile → Botón "Editar"
  ↓
EditProfile → Modifica información
  ↓
"Guardar Cambios"
  ↓
Volver a Profile actualizado
```

---

## 🎯 Características Destacadas

### ✨ Animaciones
- **Swipe Cards**: Rotación y traslación suave
- **Stamps**: Fade in/out de "LIKE" y "NOPE"
- **Transiciones**: Navegación fluida entre pantallas
- **Gestos**: Pan responder para swipe natural

### 🎨 Diseño Visual
- **Gradientes**: Rosa a rojo en headers y botones
- **Sombras**: Profundidad en cards
- **Iconografía**: Ionicons consistente
- **Tipografía**: Jerarquía clara
- **Espaciado**: Sistema consistente

### 📱 UX
- **Feedback visual**: Estados de carga
- **Estados vacíos**: Mensajes motivacionales
- **Validación**: En tiempo real
- **Accesibilidad**: Labels y placeholders claros
- **Responsive**: Adapta a diferentes tamaños

---

## 🚀 Próximos Pasos

### Backend (Pendiente)
- [ ] Integrar Firebase Authentication
- [ ] Configurar Firestore para perfiles
- [ ] Implementar Firebase Storage para fotos
- [ ] Chat en tiempo real con Firestore
- [ ] Push notifications con FCM

### Features (Pendiente)
- [ ] Geolocalización con Google Maps
- [ ] Filtros avanzados en Discover
- [ ] Sistema de reportes
- [ ] Verificación de perfil (selfie)
- [ ] Super likes limitados
- [ ] Modo oscuro
- [ ] Compartir perfiles

### Mejoras (Pendiente)
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Optimización de imágenes
- [ ] Caché de datos
- [ ] Manejo de errores mejorado
- [ ] Logging y analytics

---

## 📄 Licencia y Créditos

**Desarrollado por**: [Trivii1457](https://github.com/Trivii1457)  
**Universidad**: Universidad del Valle  
**Licencia**: MIT  
**Año**: 2025

---

<div align="center">
  <p><strong>Hecho con ❤️ para la comunidad Univalluna</strong></p>
</div>
