# 💕 CrushUV 

<div align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Framework-React%20Native-blue.svg" alt="Framework">
  <img src="https://img.shields.io/badge/University-Universidad%20del%20Valle-red.svg" alt="University">
  <img src="https://img.shields.io/badge/Status-Prototipo-yellow.svg" alt="Status">
</div>

## 📱 Descripción

**CrushUV** es una aplicación móvil de citas diseñada específicamente para la comunidad estudiantil de la **Universidad del Valle**. Este repositorio contiene el prototipo completo desarrollado en **React Native**, permitiendo que la aplicación funcione tanto en iOS como en Android.

La aplicación permite a los estudiantes conectarse, conocerse y formar relaciones significativas dentro del campus universitario, promoviendo un ambiente seguro y exclusivo para la comunidad Univalluna.

## ✨ Características Implementadas

### Autenticación
- 🔐 **Pantalla de Inicio de Sesión**: Login con correo institucional
- 📝 **Registro de Usuario**: Creación de cuenta con validación de correo @correounivalle.edu.co
- ✉️ **Verificación de Email**: Confirmación de cuenta mediante correo electrónico

### Perfil de Usuario
- 👤 **Creación de Perfil**: Formulario completo con fotos, información académica y biografía
- ✏️ **Edición de Perfil**: Actualización de información personal, fotos e intereses
- 📊 **Visualización de Perfil**: Vista detallada con estadísticas (matches, likes, super likes)

### Descubrimiento
- 🔥 **Swipe Cards**: Sistema de deslizamiento para explorar perfiles
- ❤️ **Sistema de Me Gusta**: Like, Nope y Super Like
- 🎯 **Filtros**: Búsqueda por carrera, semestre y distancia
- 📍 **Ubicación**: Muestra distancia al campus

### Matches y Chat
- 💝 **Lista de Matches**: Visualización de todas las coincidencias
- 💬 **Chat en Tiempo Real**: Mensajería instantánea con matches
- 🟢 **Estado Online**: Indicador de usuarios conectados
- 📱 **Notificaciones**: Badges de mensajes no leídos

### Configuración
- ⚙️ **Ajustes de Cuenta**: Gestión de información personal
- 🔒 **Privacidad**: Control de visibilidad y preferencias
- 🔔 **Notificaciones**: Configuración de alertas
- 📋 **Términos y Condiciones**: Información legal

## 🛠️ Tecnologías Utilizadas

- **Framework**: React Native 0.72.6
- **Navegación**: React Navigation v6
- **Gestión de Estado**: React Hooks
- **UI Components**: 
  - React Native Vector Icons
  - React Native Linear Gradient
  - React Native Gesture Handler
  - React Native Reanimated
- **Almacenamiento**: AsyncStorage
- **Imágenes**: React Native Image Picker

## 📋 Requisitos del Sistema

### Para Desarrollo
- Node.js >= 16
- npm o yarn
- React Native CLI
- Android Studio (para Android) o Xcode (para iOS)

### Para la Aplicación
- iOS 12.0+ o Android 7.0+ (API 24+)
- 4GB de RAM mínimo
- 500MB de espacio disponible
- Conexión a internet

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Trivii1457/CrushUV.git
cd CrushUV
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
```

### 3. Configuración iOS (Solo macOS)

```bash
cd ios
pod install
cd ..
```

### 4. Ejecutar la Aplicación

#### Android
```bash
npm run android
# o
yarn android
```

#### iOS
```bash
npm run ios
# o
yarn ios
```

### 5. Iniciar Metro Bundler

```bash
npm start
# o
yarn start
```

## 📁 Estructura del Proyecto

```
CrushUV/
├── src/
│   ├── App.js                    # Componente principal
│   ├── components/               # Componentes reutilizables
│   │   ├── Button.js            # Botón personalizado
│   │   ├── Input.js             # Input de texto personalizado
│   │   └── ProfileCard.js       # Tarjeta de perfil para swipe
│   ├── navigation/              # Configuración de navegación
│   │   └── AppNavigator.js      # Navegador principal
│   ├── screens/                 # Pantallas de la aplicación
│   │   ├── auth/               # Autenticación
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── EmailVerificationScreen.js
│   │   ├── profile/            # Gestión de perfil
│   │   │   ├── ProfileScreen.js
│   │   │   ├── EditProfileScreen.js
│   │   │   └── CreateProfileScreen.js
│   │   ├── discover/           # Descubrimiento
│   │   │   └── DiscoverScreen.js
│   │   ├── matches/            # Matches
│   │   │   └── MatchesScreen.js
│   │   ├── chat/               # Chat
│   │   │   ├── ChatListScreen.js
│   │   │   └── ChatDetailScreen.js
│   │   └── settings/           # Configuración
│   │       └── SettingsScreen.js
│   ├── theme/                  # Configuración de tema
│   │   └── index.js            # Colores, espaciados, fuentes
│   ├── utils/                  # Utilidades
│   └── assets/                 # Recursos (imágenes, fuentes)
├── android/                    # Configuración Android
├── ios/                        # Configuración iOS
├── index.js                    # Punto de entrada
├── app.json                    # Configuración de la app
├── package.json                # Dependencias
├── babel.config.js             # Configuración Babel
├── metro.config.js             # Configuración Metro
└── README.md                   # Este archivo
```

## 🎯 Uso de la Aplicación

### Flujo de Usuario

1. **Registro e Inicio de Sesión**
   - Abre la aplicación
   - Regístrate con tu correo @correounivalle.edu.co
   - Verifica tu correo
   - Completa tu perfil con fotos e información

2. **Descubrimiento de Perfiles**
   - Explora perfiles deslizando hacia la derecha (me gusta) o izquierda (no me gusta)
   - Desliza hacia arriba para dar un Super Like
   - Usa los botones inferiores para las mismas acciones

3. **Matches y Chat**
   - Cuando ambos se den "me gusta", recibirás un match
   - Accede a tus matches desde la pestaña de corazón
   - Inicia conversaciones desde la pestaña de chat

4. **Gestión de Perfil**
   - Edita tu perfil desde la pestaña de perfil
   - Añade o elimina fotos
   - Actualiza tu biografía e intereses
   - Configura preferencias desde Ajustes

## 🎨 Características de Diseño

### Paleta de Colores
- **Primary**: #FF4458 (Rojo vibrante)
- **Secondary**: #FE3C72 (Rosa intenso)
- **Accent**: #FF6B6B (Coral)
- **Background**: #FFFFFF (Blanco)
- **Surface**: #F8F8F8 (Gris muy claro)

### Componentes Personalizados
- **Button**: Botón con gradiente y estados de carga
- **Input**: Campo de texto con iconos y validación
- **ProfileCard**: Tarjeta de perfil con información y fotos

### Animaciones
- Swipe cards con gestos nativos
- Transiciones suaves entre pantallas
- Indicadores de estado (online, mensajes no leídos)

## 📸 Capturas de Pantalla

| Login | Descubrimiento | Matches | Chat |
|:-----:|:-------------:|:-------:|:----:|
| ![Login](docs/screenshots/login.png) | ![Discover](docs/screenshots/discover.png) | ![Matches](docs/screenshots/matches.png) | ![Chat](docs/screenshots/chat.png) |

*Las capturas de pantalla se encuentran en desarrollo*

## 🔄 Próximas Implementaciones


- [ ] Sistema de notificaciones push
- [ ] Sistema de reportes y bloqueos
- [ ] Filtros avanzados de búsqueda
- [ ] Sistema de verificación de perfil
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios y de integración

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm test -- --coverage

# Ejecutar linter
npm run lint
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Desarrollo

- Sigue las convenciones de código de React/JavaScript
- Usa componentes funcionales y hooks
- Mantén los componentes pequeños y reutilizables
- Comenta código complejo
- Escribe tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Trivii1457](https://github.com/Trivii1457)
- **Universidad**: Universidad del Valle
- **Contacto**: crushuv@correounivalle.edu.co

## 🏫 Universidad del Valle

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Escudo_de_la_Universidad_del_Valle.svg/200px-Escudo_de_la_Universidad_del_Valle.svg.png" alt="Universidad del Valle" width="100">
</div>

**CrushUV** es un proyecto estudiantil desarrollado para la comunidad de la Universidad del Valle, ubicada en Tuluá, Colombia. La aplicación busca fortalecer los vínculos sociales dentro del campus y promover conexiones significativas entre estudiantes.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Trivii1457/CrushUV/issues)
- **Email**: crushuv@correounivalle.edu.co
- **Documentación**: [Wiki del proyecto](https://github.com/Trivii1457/CrushUV/wiki)

## 🎉 Agradecimientos

- Universidad del Valle por el apoyo institucional
- Comunidad estudiantil por el feedback
- Comunidad de React Native por las herramientas de código abierto

## 📝 Notas del Prototipo

Este es un prototipo funcional que incluye:
- ✅ Todas las pantallas principales
- ✅ Navegación completa entre pantallas
- ✅ Componentes reutilizables personalizados
- ✅ Diseño responsive y moderno
- ✅ Animaciones y transiciones
- ✅ Tema de colores personalizado
- ✅ Estructura de código escalable
- ✅ Chat en tiempo real



---

<div align="center">
  <p><strong>Hecho con ❤️ por estudiantes, para estudiantes de Univalle</strong></p>
  <p>© 2025 CrushUV - Universidad del Valle</p>
</div>
