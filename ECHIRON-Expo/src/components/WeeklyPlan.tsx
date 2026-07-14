import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { DayKey } from '@/types/models';
import { Card, Chip, SectionTitle } from '@/components/ui';
import { TaskItem } from '@/components/TaskItem';

const days: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyPlan() {
  const { colors, data, assignTaskDay } = useApp();
  const [selectedDay, setSelectedDay] = useState<DayKey>('Mon');
  const selectedTasks = data.tasks.filter((task) => !task.completed && task.dueDay === selectedDay);
  const unscheduled = data.tasks.filter((task) => !task.completed && task.dueDay === null);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>WEEKLY PLAN</Text>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>Give the week shape.</Text>
        <Text style={[styles.copy, { color: colors.textMuted }]}>Choose a day, then assign unscheduled tasks without overloading the calendar.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
        {days.map((day) => (
          <Chip key={day} label={day} selected={selectedDay === day} onPress={() => setSelectedDay(day)} />
        ))}
      </ScrollView>

      <View style={styles.section}>
        <SectionTitle title={`${selectedDay} plan`} />
        <View style={styles.list}>
          {selectedTasks.length ? selectedTasks.map((task) => <TaskItem key={task.id} task={task} />) : (
            <Card>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>This day still has breathing room.</Text>
              <Text style={[styles.emptyCopy, { color: colors.textMuted }]}>Add only what the day can honestly hold.</Text>
            </Card>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Unscheduled" />
        <Text style={[styles.helper, { color: colors.textMuted }]}>Tap a task below to place it on {selectedDay}.</Text>
        <View style={styles.list}>
          {unscheduled.length ? unscheduled.map((task) => (
            <Pressable
              key={task.id}
              accessibilityRole="button"
              accessibilityLabel={`Schedule ${task.title} for ${selectedDay}`}
              onPress={() => assignTaskDay(task.id, selectedDay)}
              style={({ pressed }) => [
                styles.unscheduled,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
                <Text style={[styles.taskMeta, { color: colors.textMuted }]}>{task.category} · {task.priority}</Text>
              </View>
              <Text style={[styles.assign, { color: colors.primary }]}>Add to {selectedDay}</Text>
            </Pressable>
          )) : (
            <Card><Text style={[styles.emptyCopy, { color: colors.textMuted }]}>Every active task has a day.</Text></Card>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: 120 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.4 },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 30, marginTop: 5 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 5 },
  days: { gap: spacing.sm, paddingRight: spacing.lg },
  section: { gap: spacing.md },
  list: { gap: spacing.md },
  helper: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  emptyCopy: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, marginTop: 4 },
  unscheduled: { minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md },
  taskTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  taskMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 3, textTransform: 'capitalize' },
  assign: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
