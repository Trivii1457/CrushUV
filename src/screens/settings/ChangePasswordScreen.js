import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, borderRadius, fontSize, fontWeight} from '../../theme';

const ChangePasswordScreen = ({navigation}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'La contraseña actual es requerida';
    }
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const user = auth().currentUser;
      
      if (!user || !user.email) {
        throw new Error('No hay usuario autenticado');
      }

      // Re-authenticate user with current password
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      await user.reauthenticateWithCredential(credential);
      
      // Update password
      await user.updatePassword(newPassword);
      
      setLoading(false);
      Alert.alert(
        '✅ Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente',
        [{text: 'OK', onPress: () => navigation.goBack()}]
      );
    } catch (error) {
      setLoading(false);
      
      let errorMessage = 'No se pudo cambiar la contraseña';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'La contraseña actual es incorrecta';
        setErrors({...errors, currentPassword: errorMessage});
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La nueva contraseña es muy débil';
        setErrors({...errors, newPassword: errorMessage});
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'Por seguridad, cierra sesión y vuelve a iniciar para cambiar tu contraseña';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.iconContainer}>
          <Text style={styles.lockEmoji}>🔐</Text>
        </View>
        
        <Text style={styles.description}>
          Para cambiar tu contraseña, ingresa tu contraseña actual y luego la nueva contraseña.
        </Text>

        <Input
          label="Contraseña Actual"
          value={currentPassword}
          onChangeText={text => {
            setCurrentPassword(text);
            if (errors.currentPassword) {
              setErrors({...errors, currentPassword: null});
            }
          }}
          placeholder="Tu contraseña actual"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.currentPassword}
        />

        <Input
          label="Nueva Contraseña"
          value={newPassword}
          onChangeText={text => {
            setNewPassword(text);
            if (errors.newPassword) {
              setErrors({...errors, newPassword: null});
            }
          }}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.newPassword}
        />

        <Input
          label="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors({...errors, confirmPassword: null});
            }
          }}
          placeholder="Repite tu nueva contraseña"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.confirmPassword}
        />

        <Button
          title="Cambiar Contraseña"
          onPress={handleChangePassword}
          loading={loading}
          style={styles.changeButton}
        />

        <Text style={styles.securityNote}>
          🔒 Tu contraseña está protegida con encriptación de alto nivel
        </Text>
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
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  lockEmoji: {
    fontSize: 64,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  changeButton: {
    marginTop: spacing.xl,
  },
  securityNote: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});

export default ChangePasswordScreen;
