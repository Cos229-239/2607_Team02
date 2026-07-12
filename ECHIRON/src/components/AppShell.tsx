import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, type ThemeMode } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { Dashboard } from '@/components/Dashboard';
import { PriorityBoard } from '@/components/PriorityBoard';
import { WeeklyPlan } from '@/components/WeeklyPlan';
import { EncouragementScreen } from '@/components/EncouragementScreen';
import { ProgressScreen } from '@/components/ProgressScreen';
import { QuickCaptureModal } from '@/components/QuickCaptureModal';
import { EncouragementToast } from '@/components/EncouragementToast';

export type TabKey =
  | 'today'
  | 'priority'
  | 'plan'
  | 'encourage'
  | 'progress';

const NAV_HEIGHT = 72;

const tabs: {
  key: TabKey;
  label: string;
  symbol: string;
}[] = [
  { key: 'today', label: 'Today', symbol: '●' },
  { key: 'priority', label: 'Priorities', symbol: '◆' },
  { key: 'plan', label: 'Week', symbol: '▦' },
  { key: 'encourage', label: 'Encourage', symbol: '✦' },
  { key: 'progress', label: 'Progress', symbol: '↗' },
];

export function AppShell() {
  const {
    activeEncouragement,
    colors,
    data,
    resolvedTheme,
    setThemeMode,
  } = useApp();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('today');
  const [captureOpen, setCaptureOpen] = useState(false);

  const bottomGap = Math.max(insets.bottom, spacing.md);
  const leftGap = Math.max(
    insets.left + spacing.sm,
    spacing.md,
  );
  const rightGap = Math.max(
    insets.right + spacing.sm,
    spacing.md,
  );

  const cycleTheme = () => {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const current = order.indexOf(data.themeMode);
    setThemeMode(order[(current + 1) % order.length]);
  };

  return (
    <View
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        style={resolvedTheme === 'dark' ? 'light' : 'dark'}
      />

      <View
        style={[
          styles.topBar,
          {
            minHeight: 58 + insets.top,
            paddingTop: insets.top,
            paddingLeft: spacing.lg + insets.left,
            paddingRight: spacing.lg + insets.right,
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.brandWrap}>
          <View
            style={[
              styles.brandMark,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.brandLetter}>E</Text>
          </View>
          <Text style={[styles.brand, { color: colors.text }]}>Echiron</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Theme is ${data.themeMode}. Tap to change.`}
          onPress={cycleTheme}
          style={({ pressed }) => [
            styles.themeButton,
            {
              borderColor: colors.border,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={[styles.themeText, { color: colors.text }]}>
            {data.themeMode === 'system'
              ? 'Auto'
              : data.themeMode === 'light'
                ? 'Light'
                : 'Dark'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        {tab === 'today' ? (
          <Dashboard onAddTask={() => setCaptureOpen(true)} />
        ) : null}
        {tab === 'priority' ? <PriorityBoard /> : null}
        {tab === 'plan' ? <WeeklyPlan /> : null}
        {tab === 'encourage' ? <EncouragementScreen /> : null}
        {tab === 'progress' ? <ProgressScreen /> : null}
      </View>

      {!activeEncouragement ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add task"
          onPress={() => setCaptureOpen(true)}
          style={({ pressed }) => [
            styles.fab,
            {
              right: 22 + insets.right,
              bottom: bottomGap + NAV_HEIGHT + spacing.lg,
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              opacity: pressed ? 0.82 : 1,
            },
          ]}
        >
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      ) : null}

      <EncouragementToast
        bottom={bottomGap + NAV_HEIGHT + spacing.lg}
        left={leftGap}
        right={rightGap}
      />

      <View
        style={[
          styles.nav,
          {
            marginLeft: leftGap,
            marginRight: rightGap,
            marginBottom: bottomGap,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {tabs.map((item) => {
          const selected = tab === item.key;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={item.label}
              onPress={() => setTab(item.key)}
              style={({ pressed }) => [
                styles.navItem,
                {
                  backgroundColor: selected ? colors.surfaceAlt : 'transparent',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.navSymbol,
                  { color: selected ? colors.primary : colors.textMuted },
                ]}
              >
                {item.symbol}
              </Text>
              <Text
                numberOfLines={1}
                style={[
                  styles.navLabel,
                  { color: selected ? colors.primary : colors.textMuted },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <QuickCaptureModal
        visible={captureOpen}
        onClose={() => setCaptureOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLetter: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 20,
  },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  themeButton: {
    minHeight: 40,
    minWidth: 62,
    borderWidth: 1.5,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  themeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  main: { flex: 1, minHeight: 0 },
  fab: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  fabText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 34,
    lineHeight: 38,
  },
  nav: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginTop: spacing.sm,
    elevation: 8,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  navItem: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    gap: 2,
  },
  navSymbol: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  navLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9.5,
  },
});
