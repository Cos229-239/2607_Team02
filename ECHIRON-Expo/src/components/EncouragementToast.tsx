import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';

export function EncouragementToast({
  bottom,
  left,
  right,
}: {
  bottom: number;
  left: number;
  right: number;
}) {
  const {
    activeEncouragement,
    colors,
    data,
    saveActiveEncouragement,
    dismissActiveEncouragement,
    requestAnotherEncouragement,
  } = useApp();
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(18));

  useEffect(() => {
    if (!activeEncouragement) return;

    if (!data.encouragementPreferences.animationsEnabled) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }

    opacity.setValue(0);
    translateY.setValue(18);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 16,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    activeEncouragement,
    data.encouragementPreferences.animationsEnabled,
    opacity,
    translateY,
  ]);

  if (!activeEncouragement) return null;

  return (
    <Animated.View
      accessibilityLiveRegion="polite"
      accessibilityLabel={`${activeEncouragement.heading}. ${activeEncouragement.message}`}
      style={[
        styles.card,
        {
          bottom,
          left,
          right,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.mark,
            { backgroundColor: colors.success },
          ]}
        >
          <Text style={styles.markText}>✓</Text>
        </View>

        <View style={styles.headingWrap}>
          <Text
            numberOfLines={2}
            style={[styles.heading, { color: colors.text }]}
          >
            {activeEncouragement.heading}
          </Text>
          <Text
            style={[
              styles.principle,
              { color: colors.secondary },
            ]}
          >
            {activeEncouragement.principleTitle}
            {activeEncouragement.principleSource
              ? ` · ${activeEncouragement.principleSource}`
              : ''}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.message, { color: colors.textMuted }]}
      >
        {activeEncouragement.message}
      </Text>

      <View style={styles.actions}>
        <ToastAction
          label={activeEncouragement.saved ? 'Saved' : 'Save'}
          onPress={saveActiveEncouragement}
          selected={activeEncouragement.saved}
        />
        <ToastAction
          label="Another"
          onPress={requestAnotherEncouragement}
        />
        <ToastAction
          label="Dismiss"
          onPress={dismissActiveEncouragement}
        />
      </View>
    </Animated.View>
  );
}

function ToastAction({
  label,
  onPress,
  selected = false,
}: {
  label: string;
  onPress: () => void;
  selected?: boolean;
}) {
  const { colors } = useApp();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        {
          backgroundColor: selected
            ? colors.surfaceAlt
            : 'transparent',
          borderColor: selected
            ? colors.primary
            : colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.actionText,
          { color: selected ? colors.primary : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    zIndex: 20,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    elevation: 14,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
  },
  headingWrap: {
    flex: 1,
  },
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 21,
  },
  principle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 3,
  },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  action: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
});
