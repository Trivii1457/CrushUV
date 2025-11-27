import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, fontSize, fontWeight} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import userService from '../../services/userService';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const {signUp, sendEmailVerification} = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!acceptedTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      if (errors.terms) {
        Alert.alert('Términos requeridos', errors.terms);
      }
      return;
    }

    setLoading(true);
    const result = await signUp(email, password);

    if (result.success) {
      try {
        // Create user profile in Firestore
        await userService.createUser(result.user.uid, {
          email,
          name: name.trim(),
        });

        // Send email verification
        await sendEmailVerification();
        setLoading(false);
        navigation.navigate('EmailVerification', {email});
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'No se pudo crear el perfil: ' + error.message);
      }
    } else {
      setLoading(false);
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Crear Cuenta</Text>
      </View>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.descriptionText}>
          Únete a la comunidad de estudiantes de Univalle
        </Text>

        <Input
          label="Nombre Completo"
          value={name}
          onChangeText={text => {
            setName(text);
            if (errors.name) {
              setErrors({...errors, name: null});
            }
          }}
          placeholder="Tu nombre completo"
          iconName="person-outline"
          error={errors.name}
        />

        <Input
          label="Correo Institucional"
          value={email}
          onChangeText={text => {
            setEmail(text);
            if (errors.email) {
              setErrors({...errors, email: null});
            }
          }}
          placeholder="ejemplo@correounivalle.edu.co"
          keyboardType="email-address"
          autoCapitalize="none"
          iconName="mail-outline"
          error={errors.email}
        />

        <Input
          label="Contraseña"
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (errors.password) {
              setErrors({...errors, password: null});
            }
          }}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.password}
        />

        <Input
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            if (errors.confirmPassword) {
              setErrors({...errors, confirmPassword: null});
            }
          }}
          placeholder="Repite tu contraseña"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.confirmPassword}
        />

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}>
          <Icon
            name={acceptedTerms ? 'checkbox' : 'square-outline'}
            size={24}
            color={acceptedTerms ? colors.primary : colors.textLight}
          />
          <Text style={styles.termsText}>
            Acepto los{' '}
            <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text>
          </Text>
        </TouchableOpacity>

        <Button
          title="Registrarse"
          onPress={handleRegister}
          loading={loading}
          disabled={!acceptedTerms}
          style={styles.registerButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Inicia Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
  },
  descriptionText: {
    fontSize: fontSize.md,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  termsText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.text,
    marginLeft: spacing.sm,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  registerButton: {
    marginTop: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  loginText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  loginLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});

export default RegisterScreen;
