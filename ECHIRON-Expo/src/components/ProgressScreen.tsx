import React, { useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import {
  Card,
  PrimaryButton,
  SectionTitle,
} from '@/components/ui';

export function ProgressScreen() {
  const { colors, data, resetApp } = useApp();
  const total = data.tasks.length;
  const completed = data.tasks.filter((task) => task.completed).length;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  const focusMinutes = data.focusSessions.reduce(
    (sum, session) => sum + session.minutes,
    0,
  );
  const savedEncouragements = data.encouragementHistory.filter(
    (record) => record.saved,
  ).length;

  const categories = useMemo(() => {
    const counts = new Map<string, { total: number; completed: number }>();

    data.tasks.forEach((task) => {
      const current = counts.get(task.category) ?? { total: 0, completed: 0 };
      current.total += 1;
      if (task.completed) current.completed += 1;
      counts.set(task.category, current);
    });

    return [...counts.entries()].sort(
      (left, right) => right[1].total - left[1].total,
    );
  }, [data.tasks]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>PROGRESS</Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          Evidence of movement.
        </Text>
        <Text style={[styles.copy, { color: colors.textMuted }]}> 
          See what changed without turning progress into judgment.
        </Text>
      </View>

      <View style={styles.statGrid}>
        <StatCard label="Completion" value={`${rate}%`} colors={colors} />
        <StatCard label="Wins" value={`${completed}`} colors={colors} />
        <StatCard label="Focus time" value={`${focusMinutes}m`} colors={colors} />
        <StatCard label="Saved lessons" value={`${savedEncouragements}`} colors={colors} />
      </View>

      <Card>
        <Text style={[styles.barLabel, { color: colors.text }]}>Overall progress</Text>
        <View
          style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}
          accessibilityLabel={`${rate} percent complete`}
        >
          <View
            style={[
              styles.barFill,
              { width: `${rate}%`, backgroundColor: colors.success },
            ]}
          />
        </View>
        <Text style={[styles.barCopy, { color: colors.textMuted }]}> 
          {completed} of {total} actions complete
        </Text>
      </Card>

      <View style={styles.section}>
        <SectionTitle title="By category" />
        {categories.length ? (
          categories.map(([category, counts]) => {
            const categoryRate = Math.round(
              (counts.completed / counts.total) * 100,
            );

            return (
              <Card key={category} style={styles.categoryCard}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}> 
                    {category}
                  </Text>
                  <Text style={[styles.categoryCopy, { color: colors.textMuted }]}> 
                    {counts.completed} of {counts.total} completed
                  </Text>
                </View>
                <Text style={[styles.categoryRate, { color: colors.secondary }]}> 
                  {categoryRate}%
                </Text>
              </Card>
            );
          })
        ) : (
          <Card>
            <Text style={[styles.categoryCopy, { color: colors.textMuted }]}> 
              No progress history yet.
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Data sovereignty" />
        <Card style={{ gap: spacing.md }}>
          <Text style={[styles.dataTitle, { color: colors.text }]}> 
            Your data remains local
          </Text>
          <Text style={[styles.dataCopy, { color: colors.textMuted }]}> 
            Echiron stores your profile, tasks, schedule, focus history,
            encouragement preferences, saved messages, and locally generated
            reflections on this device. It does not sell data, display ads,
            send analytics, or call an external AI service in this release.
          </Text>
          <PrimaryButton
            label="Reset all local data"
            variant="danger"
            onPress={() =>
              Alert.alert(
                'Reset Echiron?',
                'This permanently deletes the profile, tasks, schedule, focus history, encouragement history, saved messages, and preferences stored on this device.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => resetApp(),
                  },
                ],
              )
            }
          />
        </Card>
      </View>
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useApp>['colors'];
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: 120,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    marginTop: 5,
  },
  copy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    width: '47.8%',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  statValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
  barLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  barTrack: {
    height: 14,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  barFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  barCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: spacing.sm,
  },
  section: { gap: spacing.md },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  categoryTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  categoryCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 3,
  },
  categoryRate: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 22,
  },
  dataTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  dataCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
});
