# 💕 CrushUV

<div align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-green.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Framework-React%20Native-blue.svg" alt="Framework">
  <img src="https://img.shields.io/badge/University-Universidad%20del%20Valle-red.svg" alt="University">
  <img src="https://img.shields.io/badge/Status-Prototipo-yellow.svg" alt="Status">
</div>

> 🚀 **Nota**: Este proyecto ahora incluye una implementación completa en React Native. Consulta [REACT_NATIVE_README.md](REACT_NATIVE_README.md) para más detalles sobre la versión React Native.

## 📱 Descripción

**CrushUV** es una aplicación móvil de citas diseñada específicamente para la comunidad estudiantil de la **Universidad del Valle**. La aplicación permite a los estudiantes conectarse, conocerse y formar relaciones significativas dentro del campus universitario, promoviendo un ambiente seguro y exclusivo para la comunidad Univalluna.

## ✨ Características Principales

- 🎓 **Exclusivo para Universidad del Valle**: Solo estudiantes verificados pueden acceder
- 👤 **Perfiles Personalizados**: Crea un perfil atractivo con fotos y información académica
- 💝 **Sistema de Matching**: Algoritmo inteligente para encontrar compatibilidades
- 💬 **Chat en Tiempo Real**: Mensajería instantánea con WebSocket (Socket.IO)
- ⌨️ **Indicadores de Escritura**: Ve cuando alguien está escribiendo
- 🟢 **Estado Online**: Sabe cuando tus matches están conectados
- 🏫 **Filtros Académicos**: Busca por carrera, semestre o facultad
- 🔒 **Seguridad y Privacidad**: Verificación de identidad estudiantil
- 🌟 **Sistema de Valoraciones**: Califica la experiencia con otros usuarios
- 📊 **Estadísticas de Perfil**: Visualiza tu actividad y popularidad
- 🎉 **Eventos Universitarios**: Encuentra compañía para eventos del campus

## 🛠️ Tecnologías Utilizadas

### React Native Version
- **Framework**: React Native 0.72.6
- **Lenguaje**: JavaScript (ES6+)
- **Navegación**: React Navigation v6
- **Estado Global**: React Context API
- **Chat en Tiempo Real**: Socket.IO Client
- **UI Components**: Custom components + React Native Vector Icons
- **Gestures**: React Native Gesture Handler
- **Animaciones**: React Native Reanimated

### Backend (Previsto)
- **Lenguaje**: Node.js / Kotlin
- **Base de Datos**: Firebase Firestore / PostgreSQL
- **Autenticación**: Firebase Authentication / JWT
- **Almacenamiento**: Firebase Storage / AWS S3
- **Mensajería en Tiempo Real**: Socket.IO Server
- **Push Notifications**: Firebase Cloud Messaging
- **Maps**: Google Maps API

## 📋 Requisitos del Sistema

- Android 7.0 (API level 24) o superior
- 4GB de RAM mínimo
- 500MB de espacio de almacenamiento disponible
- Conexión a internet activa
- Cámara para fotos de perfil
- GPS para ubicación (opcional)

## 🚀 Instalación y Configuración

### Para Desarrolladores - React Native

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Trivii1457/CrushUV.git
   cd CrushUV
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configura el servidor WebSocket**:
   
   El chat en tiempo real requiere un servidor Socket.IO. Para desarrollo local:
   
   ```bash
   # Instala dependencias del servidor de ejemplo
   npm install --prefix . express socket.io cors
   
   # Inicia el servidor
   node example-server.js
   ```
   
   El servidor estará disponible en `http://localhost:3000`

4. **Ejecuta la aplicación**:
   
   Para iOS:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```
   
   Para Android:
   ```bash
   npm run android
   ```

5. **Configuración de producción**:
   
   Actualiza la URL del servidor en `src/services/socketService.js`:
   ```javascript
   const SOCKET_URL = 'https://tu-servidor.com';
   ```

### Para Desarrolladores - Servidor Backend

Para implementar tu propio servidor Socket.IO, consulta:
- [WEBSOCKET_IMPLEMENTATION.md](WEBSOCKET_IMPLEMENTATION.md) - Guía completa
- [example-server.js](example-server.js) - Servidor de ejemplo

### Para Usuarios

1. Descarga la APK desde [Releases](https://github.com/Trivii1457/CrushUV/releases)
2. Habilita "Fuentes desconocidas" en configuración de Android
3. Instala la APK
4. Regístrate con tu correo institucional (@correounivalle.edu.co)

## 📁 Estructura del Proyecto

```
CrushUV/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/crushuv/
│   │   │   │   ├── data/          # Repositorios y fuentes de datos
│   │   │   │   ├── di/            # Inyección de dependencias
│   │   │   │   ├── domain/        # Casos de uso y entidades
│   │   │   │   ├── presentation/  # ViewModels y UI
│   │   │   │   │   ├── auth/      # Autenticación
│   │   │   │   │   ├── chat/      # Sistema de mensajería
│   │   │   │   │   ├── discover/  # Descubrimiento de perfiles
│   │   │   │   │   ├── profile/   # Gestión de perfil
│   │   │   │   │   └── matches/   # Sistema de matches
│   │   │   │   └── utils/         # Utilidades y extensiones
│   │   │   ├── res/              # Recursos (layouts, strings, etc.)
│   │   │   └── AndroidManifest.xml
│   │   └── test/                 # Pruebas unitarias
│   ├── build.gradle
│   └── proguard-rules.pro
├── buildSrc/                     # Scripts de construcción
├── gradle/
├── build.gradle
├── settings.gradle
└── README.md
```

## 🎯 Cómo Usar la Aplicación

### Registro y Configuración Inicial
1. **Descarga e instala** la aplicación
2. **Regístrate** con tu correo institucional de Univalle
3. **Verifica tu cuenta** a través del email enviado
4. **Completa tu perfil** con fotos y información personal
5. **Establece tus preferencias** de búsqueda

### Descubrimiento y Matching
1. **Explora perfiles** deslizando hacia la derecha (me gusta) o izquierda (no me gusta)
2. **Usa filtros** para encontrar personas de tu carrera o semestre
3. **¡Haz match!** cuando ambos se den "me gusta"
4. **Inicia conversaciones** con tus matches

### Funciones Avanzadas
- **Súper Like**: Dale súper like a perfiles que realmente te interesen
- **Boost**: Aumenta tu visibilidad durante eventos especiales
- **Ubicación**: Encuentra personas cerca de ti en el campus
- **Eventos**: Únete a actividades universitarias con otros usuarios

## 📸 Capturas de Pantalla

*[Las capturas de pantalla se añadirán cuando la aplicación esté desarrollada]*

| Inicio de Sesión | Descubrimiento | Chat | Perfil |
|:---------------:|:--------------:|:----:|:------:|
| ![Login](docs/screenshots/login.png) | ![Discover](docs/screenshots/discover.png) | ![Chat](docs/screenshots/chat.png) | ![Profile](docs/screenshots/profile.png) |

## 🔒 Seguridad y Privacidad

- **Verificación estudiantil**: Solo correos @correounivalle.edu.co
- **Moderación de contenido**: Sistema automático y reportes de usuarios
- **Cifrado de mensajes**: Comunicaciones seguras
- **Control de privacidad**: Configuración detallada de visibilidad
- **Bloqueo y reportes**: Herramientas para mantener un ambiente seguro

## 🧪 Testing

Para ejecutar las pruebas:

```bash
# Pruebas unitarias
./gradlew testDebugUnitTest

# Pruebas de instrumentación
./gradlew connectedAndroidTest

# Reporte de cobertura
./gradlew createDebugCoverageReport
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Desarrollo

- Sigue las convenciones de código de Kotlin
- Escribe pruebas para nuevas funcionalidades
- Actualiza la documentación cuando sea necesario
- Usa commits descriptivos siguiendo [Conventional Commits](https://conventionalcommits.org/)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo de Desarrollo

- **Desarrollador Principal**: [Trivii1457](https://github.com/Trivii1457)
- **Universidad**: Universidad del Valle
- **Contacto**: [crushuv@correounivalle.edu.co](mailto:crushuv@correounivalle.edu.co)

## 🏫 Universidad del Valle

<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Escudo_de_la_Universidad_del_Valle.svg/200px-Escudo_de_la_Universidad_del_Valle.svg.png" alt="Universidad del Valle" width="100">
</div>

**CrushUV** es un proyecto estudiantil desarrollado para la comunidad de la Universidad del Valle, ubicada en Tulua, Colombia. La aplicación busca fortalecer los vínculos sociales dentro del campus y promover conexiones significativas entre estudiantes.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Trivii1457/CrushUV/issues)
- **Email**: crushuv@correounivalle.edu.co
- **Documentación**: [Wiki del proyecto](https://github.com/Trivii1457/CrushUV/wiki)

## 🎉 Agradecimientos

- Universidad del Valle por el apoyo institucional
- Comunidad estudiantil por el feedback y testing
- Desarrolladores de las librerías de código abierto utilizadas

---

<div align="center">
  <p><strong>Hecho con ❤️ por estudiantes, para estudiantes de Univalle</strong></p>
  <p>© 2025 CrushUV - Universidad del Valle</p>
</div>
