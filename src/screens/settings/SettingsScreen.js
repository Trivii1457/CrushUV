import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {colors, spacing, borderRadius, fontSize, fontWeight} from '../../theme';
import {useAuth} from '../../context/AuthContext';

// Mapeo de iconos a emojis
const iconToEmoji = {
  'person-outline': '👤',
  'key-outline': '🔑',
  'shield-checkmark-outline': '✅',
  'notifications-outline': '🔔',
  'eye-outline': '👁️',
  'location-outline': '📍',
  'lock-closed-outline': '🔒',
  'filter-outline': '📋',
  'navigate-outline': '🧭',
  'help-circle-outline': '❓',
  'document-text-outline': '📄',
  'shield-outline': '🛡️',
  'information-circle-outline': 'ℹ️',
  'log-out-outline': '🚪',
  'chevron-forward': '▶️',
  'arrow-back': '⬅️',
};

const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightComponent,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}>
    <View style={styles.settingLeft}>
      <View style={styles.iconContainer}>
        <Text style={styles.settingEmoji}>{iconToEmoji[icon] || '⚙️'}</Text>
      </View>
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightComponent || (showArrow && (
      <Text style={styles.arrowEmoji}>▶️</Text>
    ))}
  </TouchableOpacity>
);

const SettingsScreen = ({navigation}) => {
  const [notifications, setNotifications] = React.useState(true);
  const [showOnline, setShowOnline] = React.useState(true);
  const [showDistance, setShowDistance] = React.useState(true);
  const {signOut} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would delete the account
            Alert.alert('Función no disponible', 'Esta función estará disponible próximamente');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <View style={styles.section}>
          <SettingItem
            icon="person-outline"
            title="Editar Perfil"
            subtitle="Actualiza tu información"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingItem
            icon="key-outline"
            title="Cambiar Contraseña"
            subtitle="Actualiza tu contraseña"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Verificación"
            subtitle="Verifica tu identidad"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.sectionTitle}>Privacidad</Text>
        <View style={styles.section}>
          <SettingItem
            icon="notifications-outline"
            title="Notificaciones"
            subtitle="Recibe alertas de nuevos matches"
            showArrow={false}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={colors.white}
              />
            }
          />
          <SettingItem
            icon="eye-outline"
            title="Mostrar estado en línea"
            showArrow={false}
            rightComponent={
              <Switch
                value={showOnline}
                onValueChange={setShowOnline}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={colors.white}
              />
            }
          />
          <SettingItem
            icon="location-outline"
            title="Mostrar distancia"
            showArrow={false}
            rightComponent={
              <Switch
                value={showDistance}
                onValueChange={setShowDistance}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={colors.white}
              />
            }
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Cuenta Privada"
            subtitle="Controla quién puede verte"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.sectionTitle}>Preferencias de Búsqueda</Text>
        <View style={styles.section}>
          <SettingItem
            icon="filter-outline"
            title="Filtros"
            subtitle="Carrera, semestre, edad"
            onPress={() => {}}
          />
          <SettingItem
            icon="navigate-outline"
            title="Distancia"
            subtitle="Máximo 5 km"
            onPress={() => {}}
          />
        </View>

        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.section}>
          <SettingItem
            icon="help-circle-outline"
            title="Ayuda y Soporte"
            subtitle="Preguntas frecuentes"
            onPress={() => {}}
          />
          <SettingItem
            icon="document-text-outline"
            title="Términos y Condiciones"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-outline"
            title="Política de Privacidad"
            onPress={() => {}}
          />
          <SettingItem
            icon="information-circle-outline"
            title="Acerca de"
            subtitle="Versión 1.0.0"
            onPress={() => {}}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutEmoji}>🚪</Text>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteText}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  backEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.textLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  deleteText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    textDecorationLine: 'underline',
  },
  settingEmoji: {
    fontSize: 22,
  },
  arrowEmoji: {
    fontSize: 14,
  },
  logoutEmoji: {
    fontSize: 22,
  },
});

export default SettingsScreen;
