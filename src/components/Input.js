import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {colors, spacing, borderRadius, fontSize} from '../theme';

// Importar imágenes de ojo
import OjoAbierto from '../assets/images/ojo.png';
import OjoCerrado from '../assets/images/ojo_cerrado.png';

// Mapeo de iconos a emojis
const iconToEmoji = {
  'mail-outline': '📧',
  'lock-closed-outline': '🔒',
  'person-outline': '👤',
  'school-outline': '🎓',
  'book-outline': '📚',
  'calendar-outline': '📅',
  'search-outline': '🔍',
  'location-outline': '📍',
  'heart-outline': '💕',
  'call-outline': '📞',
  'chatbubble-outline': '💬',
  'settings-outline': '⚙️',
  'create-outline': '✏️',
};

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  iconName,
  error,
  multiline,
  numberOfLines,
  keyboardType,
  autoCapitalize,
  style,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {iconName && (
          <Text style={styles.icon}>{iconToEmoji[iconName] || '📝'}</Text>
        )}
        <TextInput
          style={[
            styles.input,
            iconName && styles.inputWithIcon,
            multiline && styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isPassword && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Image 
              source={isPasswordVisible ? OjoAbierto : OjoCerrado} 
              style={styles.eyeIcon} 
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: spacing.sm,
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  eyeButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: colors.textLight,
  },
});

export default Input;
