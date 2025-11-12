# 💕 CrushUV

<div align="center">
  <img src="https://img.shields.io/badge/Platform-Android-green.svg" alt="Platform">
  <img src="https://img.shields.io/badge/Language-Kotlin-blue.svg" alt="Language">
  <img src="https://img.shields.io/badge/University-Universidad%20del%20Valle-red.svg" alt="University">
  <img src="https://img.shields.io/badge/Status-En%20Desarrollo-yellow.svg" alt="Status">
</div>

## 📱 Descripción

**CrushUV** es una aplicación móvil de citas diseñada específicamente para la comunidad estudiantil de la **Universidad del Valle**. La aplicación permite a los estudiantes conectarse, conocerse y formar relaciones significativas dentro del campus universitario, promoviendo un ambiente seguro y exclusivo para la comunidad Univalluna.

## ✨ Características Principales

- 🎓 **Exclusivo para Universidad del Valle**: Solo estudiantes verificados pueden acceder
- 👤 **Perfiles Personalizados**: Crea un perfil atractivo con fotos y información académica
- 💝 **Sistema de Matching**: Algoritmo inteligente para encontrar compatibilidades
- 💬 **Chat Integrado**: Mensajería en tiempo real con matches
- 🏫 **Filtros Académicos**: Busca por carrera, semestre o facultad
- 🔒 **Seguridad y Privacidad**: Verificación de identidad estudiantil
- 🌟 **Sistema de Valoraciones**: Califica la experiencia con otros usuarios
- 📊 **Estadísticas de Perfil**: Visualiza tu actividad y popularidad
- 🎉 **Eventos Universitarios**: Encuentra compañía para eventos del campus

## 🛠️ Tecnologías Utilizadas

- **Lenguaje**: Kotlin
- **Plataforma**: Android (API 24+)
- **Arquitectura**: MVVM (Model-View-ViewModel)
- **Base de Datos**: Room Database + Firebase Firestore
- **Autenticación**: Firebase Authentication
- **Almacenamiento**: Firebase Storage
- **Mensajería**: Firebase Cloud Messaging
- **Maps**: Google Maps API
- **UI Framework**: Material Design Components
- **Navegación**: Navigation Component
- **Inyección de Dependencias**: Hilt
- **Imágenes**: Glide
- **Networking**: Retrofit + OkHttp

## 📋 Requisitos del Sistema

- Android 7.0 (API level 24) o superior
- 4GB de RAM mínimo
- 500MB de espacio de almacenamiento disponible
- Conexión a internet activa
- Cámara para fotos de perfil
- GPS para ubicación (opcional)

## 🚀 Instalación y Configuración

### Para Desarrolladores

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/Trivii1457/CrushUV.git
   cd CrushUV
   ```

2. **Abre el proyecto en Android Studio**:
   - Instala Android Studio Arctic Fox o superior
   - Importa el proyecto
   - Sincroniza las dependencias de Gradle

3. **Configuración de Firebase**:
   - Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Descarga el archivo `google-services.json`
   - Colócalo en la carpeta `app/`
   - Habilita Authentication, Firestore y Storage

4. **Configuración de APIs**:
   - Obtén una API Key de Google Maps
   - Añade la clave en `local.properties`:
     ```properties
     MAPS_API_KEY=tu_api_key_aqui
     ```

5. **Ejecuta la aplicación**:
   ```bash
   ./gradlew assembleDebug
   ```

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
