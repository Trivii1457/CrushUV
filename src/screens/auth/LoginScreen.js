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
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {colors, spacing, borderRadius, fontSize, fontWeight} from '../../theme';
import {useAuth} from '../../context/AuthContext';
import Logo from '../../assets/images/Logo.png';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const {signIn, resetPassword} = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Correo requerido',
        'Ingresa tu correo electrónico para recuperar tu contraseña',
      );
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      Alert.alert(
        'Correo enviado',
        'Te hemos enviado un correo para restablecer tu contraseña',
      );
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBackground}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
          </View>
        </View>
        <Text style={styles.appName}>CrushUV</Text>
        <Text style={styles.subtitle}>Encuentra tu crush en Univalle 🎓</Text>
      </LinearGradient>

      <ScrollView
        style={styles.formContainer}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Bienvenido de nuevo 👋</Text>
        <Text style={styles.descriptionText}>
          Ingresa con tu correo institucional
        </Text>

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
          placeholder="••••••••"
          secureTextEntry
          iconName="lock-closed-outline"
          error={errors.password}
        />

        <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Regístrate</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 1.5,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xl * 2,
    borderBottomRightRadius: borderRadius.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoBackground: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 110,
    height: 110,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.white,
    marginTop: spacing.xs,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: spacing.lg,
  },
  welcomeText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    marginTop: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textLight,
    fontSize: fontSize.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signupText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  signupLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
});

export default LoginScreen;
