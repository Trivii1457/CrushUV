# 🚀 Guía de Inicio Rápido - CrushUV

## ⚡ Instalación Express (5 minutos)

### Prerrequisitos
- ✅ Node.js v16 o superior
- ✅ npm o yarn
- ✅ React Native CLI
- ✅ Android Studio (para Android) o Xcode (para iOS/macOS)

### Pasos de Instalación

#### 1. Clonar e Instalar
```bash
# Clonar el repositorio
git clone https://github.com/Trivii1457/CrushUV.git
cd CrushUV

# Instalar dependencias
npm install
# o
yarn install
```

#### 2. Configuración iOS (Solo macOS)
```bash
cd ios
pod install
cd ..
```

#### 3. Ejecutar la Aplicación

**Android**:
```bash
# Asegúrate de tener un emulador corriendo o un dispositivo conectado
npm run android
```

**iOS** (Solo macOS):
```bash
# Asegúrate de tener un simulador corriendo
npm run ios
```

#### 4. Iniciar Metro Bundler (si no inició automáticamente)
```bash
npm start
```

---

## 📂 Estructura de Archivos Importante

```
CrushUV/
├── src/
│   ├── App.js                    # ⭐ Punto de entrada principal
│   ├── components/               # 🧩 Componentes reutilizables
│   ├── navigation/               # 🧭 Configuración de navegación
│   ├── screens/                  # 📱 Todas las pantallas
│   └── theme/                    # 🎨 Configuración de diseño
├── index.js                      # 🚀 Registro de la app
└── package.json                  # 📦 Dependencias
```

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
# Iniciar Metro Bundler
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Limpiar caché
npm start -- --reset-cache
```

### Calidad de Código
```bash
# Linter
npm run lint

# Ejecutar tests
npm test
```

### Limpieza (Si tienes problemas)
```bash
# Android
cd android && ./gradlew clean && cd ..

# iOS
cd ios && rm -rf Pods && pod install && cd ..

# Node modules
rm -rf node_modules && npm install
```

---

## 🎯 Primera Modificación - Tutorial

### Cambiar el Color Principal

1. Abre `src/theme/index.js`
2. Busca la línea:
   ```javascript
   primary: '#FF4458',
   ```
3. Cámbiala a tu color favorito:
   ```javascript
   primary: '#0000FF',  // Azul
   ```
4. Guarda y recarga la app (presiona `R` dos veces en el terminal de Metro)

### Añadir una Nueva Pantalla

1. Crea un archivo en `src/screens/`:
   ```javascript
   // src/screens/MiPantalla.js
   import React from 'react';
   import {View, Text, StyleSheet} from 'react-native';
   
   const MiPantalla = () => {
     return (
       <View style={styles.container}>
         <Text>¡Mi Nueva Pantalla!</Text>
       </View>
     );
   };
   
   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
   });
   
   export default MiPantalla;
   ```

2. Añádela al navegador en `src/navigation/AppNavigator.js`

---

## 🐛 Solución de Problemas Comunes

### Error: "Unable to boot simulator"
**Solución**: 
```bash
sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService
```

### Error: "Metro Bundler can't listen on port 8081"
**Solución**:
```bash
# Matar el proceso en el puerto 8081
lsof -ti:8081 | xargs kill
# O usar otro puerto
npm start -- --port 8088
```

### Error: "Unable to resolve module"
**Solución**:
```bash
# Limpiar caché
npm start -- --reset-cache
# Y reinstalar
rm -rf node_modules && npm install
```

### Error de Gradle (Android)
**Solución**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Error de CocoaPods (iOS)
**Solución**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

---

## 📱 Ejecutar en Dispositivo Real

### Android
1. Habilita "Modo Desarrollador" en tu dispositivo
2. Habilita "Depuración USB"
3. Conecta por USB
4. Ejecuta: `npm run android`

### iOS
1. Abre `ios/CrushUV.xcworkspace` en Xcode
2. Selecciona tu dispositivo
3. Presiona "Play" (▶️)

---

## 🎨 Personalización Rápida

### Cambiar Nombre de la App
1. `app.json`:
   ```json
   {
     "name": "MiApp",
     "displayName": "Mi App"
   }
   ```

### Cambiar Icono de la App
1. Genera iconos en todas las resoluciones necesarias
2. Reemplaza en:
   - Android: `android/app/src/main/res/mipmap-*/ic_launcher.png`
   - iOS: `ios/CrushUV/Images.xcassets/AppIcon.appiconset/`

### Cambiar Splash Screen
- Usa `react-native-splash-screen` (pendiente de instalación)

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

### Tutoriales Recomendados
- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [React Navigation Tutorial](https://reactnavigation.org/docs/getting-started)
- [Swipe Cards Tutorial](https://www.youtube.com/results?search_query=react+native+swipe+cards)

---

## 🤝 Contribuir al Proyecto

### Flujo de Trabajo
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Haz commit: `git commit -m 'Add: Mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Convenciones de Código
- Usa componentes funcionales
- Usa hooks en lugar de clases
- Nombres en PascalCase para componentes
- Nombres en camelCase para funciones
- Comentarios claros en código complejo

---

## ✅ Checklist para Producción

Antes de publicar en stores:

- [ ] Configurar Firebase (Authentication, Firestore, Storage)
- [ ] Añadir manejo de errores global
- [ ] Implementar sistema de logging
- [ ] Optimizar imágenes y assets
- [ ] Configurar ProGuard (Android)
- [ ] Configurar Code Signing (iOS)
- [ ] Añadir analytics (Firebase Analytics)
- [ ] Tests unitarios y de integración
- [ ] Probar en dispositivos reales
- [ ] Configurar CI/CD
- [ ] Política de privacidad y términos
- [ ] Iconos y splash screens finales
- [ ] Screenshots para stores
- [ ] Descripción de la app en stores

---

## 📞 Soporte

### ¿Necesitas Ayuda?
- 📧 Email: crushuv@correounivalle.edu.co
- 🐛 Issues: [GitHub Issues](https://github.com/Trivii1457/CrushUV/issues)
- 📖 Wiki: [GitHub Wiki](https://github.com/Trivii1457/CrushUV/wiki)

### Comunidad
- Únete a la comunidad de React Native
- Pregunta en Stack Overflow con tag `react-native`
- Sigue a @reactnative en Twitter

---

## 🎉 ¡Listo para Desarrollar!

Ya tienes todo configurado. Aquí están tus próximos pasos:

1. ✅ Explora el código en `src/`
2. ✅ Lee `FEATURES_GUIDE.md` para entender las pantallas
3. ✅ Modifica algo pequeño para familiarizarte
4. ✅ Consulta `REACT_NATIVE_README.md` para más detalles
5. ✅ ¡Empieza a construir!

---

<div align="center">
  <p><strong>Happy Coding! 💻❤️</strong></p>
  <p>Hecho con ❤️ para la comunidad Univalluna</p>
</div>
