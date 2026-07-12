import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export function LoadingScreen() {
  const { colors } = useApp();
  return (
    <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} accessibilityLabel="Loading Echiron" />
    </View>
  );
}

export function Card({ children, style, accessibilityLabel }: { children: React.ReactNode; style?: ViewStyle; accessibilityLabel?: string }) {
  const { colors } = useApp();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.shadow },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}) {
  const { colors } = useApp();
  const backgroundColor = variant === 'primary'
    ? colors.primary
    : variant === 'secondary'
      ? colors.secondary
      : variant === 'danger'
        ? colors.danger
        : 'transparent';
  const textColor = variant === 'ghost' ? colors.primary : '#FFFFFF';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: variant === 'ghost' ? colors.border : backgroundColor,
          opacity: disabled ? 0.45 : pressed ? 0.84 : 1,
          borderWidth: variant === 'ghost' ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  const { colors } = useApp();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.field, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }, style]}
        {...props}
      />
    </View>
  );
}

export function Chip({ label, selected, onPress, tone = 'primary' }: { label: string; selected: boolean; onPress: () => void; tone?: 'primary' | 'secondary' | 'warning' | 'danger' }) {
  const { colors } = useApp();
  const toneColor = tone === 'primary' ? colors.primary : tone === 'secondary' ? colors.secondary : tone === 'warning' ? colors.warning : colors.danger;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? toneColor : colors.surfaceAlt,
          borderColor: selected ? toneColor : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  const { colors } = useApp();
  return (
    <View style={styles.sectionTitleRow}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  fieldWrap: { gap: spacing.sm },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  field: {
    minHeight: 50,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 20 },
});
