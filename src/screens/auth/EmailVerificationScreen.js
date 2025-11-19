import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../../components/Button';
import {colors, spacing, fontSize, fontWeight} from '../../theme';

const EmailVerificationScreen = ({navigation}) => {
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
    }, 1500);
  };

  const handleContinue = () => {
    navigation.navigate('CreateProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="mail" size={80} color={colors.primary} />
        </View>

        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.description}>
          Hemos enviado un código de verificación a tu correo institucional.
          Por favor, revisa tu bandeja de entrada y haz clic en el enlace para
          verificar tu cuenta.
        </Text>

        <View style={styles.emailContainer}>
          <Icon name="mail-outline" size={20} color={colors.textLight} />
          <Text style={styles.email}>ejemplo@correounivalle.edu.co</Text>
        </View>

        <Button
          title="Continuar"
          onPress={handleContinue}
          style={styles.continueButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>¿No recibiste el correo? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={styles.resendLink}>
              {resending ? 'Enviando...' : 'Reenviar'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => navigation.navigate('Login')}>
          <Icon name="arrow-back" size={20} color={colors.primary} />
          <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl * 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textDark,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.xl,
  },
  email: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  continueButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  resendLink: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.medium,
  },
});

export default EmailVerificationScreen;
