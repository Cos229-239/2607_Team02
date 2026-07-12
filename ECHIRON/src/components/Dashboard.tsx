import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import {
  Card,
  PrimaryButton,
  SectionTitle,
} from '@/components/ui';
import { TaskItem } from '@/components/TaskItem';

export function Dashboard({
  onAddTask,
}: {
  onAddTask: () => void;
}) {
  const { colors, data, recordFocusSession } = useApp();
  const [focusRunning, setFocusRunning] = useState(false);
  const profile = data.profile!;
  const activeTasks = data.tasks.filter((task) => !task.completed);
  const completedToday = data.tasks.filter(
    (task) =>
      task.completedAt &&
      new Date(task.completedAt).toDateString() === new Date().toDateString(),
  ).length;
  const topTasks = [...activeTasks]
    .sort(
      (left, right) =>
        priorityRank(right.priority) - priorityRank(left.priority),
    )
    .slice(0, 3);
  const focusMinutes = useMemo(
    () =>
      data.focusSessions.reduce(
        (sum, session) => sum + session.minutes,
        0,
      ),
    [data.focusSessions],
  );
  const latestEncouragement = data.encouragementHistory.find(
    (record) => !record.dismissed,
  );

  const finishFocus = () => {
    recordFocusSession(25);
    setFocusRunning(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>TODAY</Text>
        <Text
          accessibilityRole="header"
          style={[styles.greeting, { color: colors.text }]}
        >
          Keep moving, {profile.preferredName}.
        </Text>
        <Text style={[styles.subhead, { color: colors.textMuted }]}> 
          One honest step still counts. Choose the next good action.
        </Text>
      </View>

      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.heroCard}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>Momentum score</Text>
            <Text style={styles.heroNumber}>
              {Math.min(
                100,
                45 + completedToday * 10 + data.focusSessions.length * 5,
              )}
            </Text>
          </View>
          <View style={styles.heroStats}>
            <Text style={styles.heroStat}>{activeTasks.length} open tasks</Text>
            <Text style={styles.heroStat}>{completedToday} wins today</Text>
            <Text style={styles.heroStat}>{focusMinutes} focus minutes</Text>
          </View>
        </View>
        <Text style={styles.heroCopy}>Progress becomes momentum when it is seen.</Text>
      </LinearGradient>

      <Card style={styles.focusCard}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.focusTitle, { color: colors.text }]}> 
            {focusRunning ? 'Focus block active' : 'Protect 25 minutes'}
          </Text>
          <Text style={[styles.focusCopy, { color: colors.textMuted }]}> 
            {focusRunning
              ? 'Stay with one task. Finish the block when the work is complete.'
              : 'Start a distraction-free session and record the win.'}
          </Text>
        </View>
        <PrimaryButton
          label={focusRunning ? 'Finish block' : 'Start focus'}
          variant={focusRunning ? 'secondary' : 'primary'}
          onPress={focusRunning ? finishFocus : () => setFocusRunning(true)}
        />
      </Card>

      <SectionTitle
        title="Next actions"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a task"
            onPress={onAddTask}
          >
            <Text style={[styles.action, { color: colors.primary }]}>Add task</Text>
          </Pressable>
        }
      />

      <View style={styles.list}>
        {topTasks.length ? (
          topTasks.map((task) => <TaskItem key={task.id} task={task} />)
        ) : (
          <Card>
            <Text style={[styles.emptyTitle, { color: colors.text }]}> 
              Your next-action lane is clear.
            </Text>
            <Text style={[styles.emptyCopy, { color: colors.textMuted }]}> 
              Add the next thing worth moving forward.
            </Text>
          </Card>
        )}
      </View>

      <SectionTitle title="Today’s encouragement" />
      <Card>
        <Text style={[styles.signalTitle, { color: colors.text }]}> 
          {latestEncouragement?.principleTitle ?? 'Progress without punishment'}
        </Text>
        <Text style={[styles.signalCopy, { color: colors.textMuted }]}> 
          {latestEncouragement?.message ??
            'Echiron recognizes completed actions and focused time—not your worth. Reset, return, and take the next good step when life changes.'}
        </Text>
      </Card>
    </ScrollView>
  );
}

function priorityRank(priority: string) {
  return priority === 'urgent'
    ? 4
    : priority === 'high'
      ? 3
      : priority === 'medium'
        ? 2
        : 1;
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
  greeting: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    lineHeight: 37,
    marginTop: 5,
  },
  subhead: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
  },
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  heroLabel: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  heroNumber: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 52,
    lineHeight: 60,
  },
  heroStats: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  heroStat: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  heroCopy: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  focusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  focusTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  focusCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  action: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    padding: spacing.sm,
  },
  list: { gap: spacing.md },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  emptyCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 4,
  },
  signalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
  signalCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
});
