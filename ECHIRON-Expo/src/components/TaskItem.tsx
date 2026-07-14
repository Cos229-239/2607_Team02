import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { Task } from '@/types/models';

const priorityLabels = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export function TaskItem({ task, compact = false }: { task: Task; compact?: boolean }) {
  const { colors, toggleTask, deleteTask, cyclePriority } = useApp();
  const priorityColor = task.priority === 'urgent'
    ? colors.danger
    : task.priority === 'high'
      ? colors.warning
      : task.priority === 'medium'
        ? colors.secondary
        : colors.textMuted;

  return (
    <View style={[styles.wrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`${task.completed ? 'Mark incomplete' : 'Complete'} ${task.title}`}
        onPress={() => toggleTask(task.id)}
        style={({ pressed }) => [
          styles.checkbox,
          {
            borderColor: task.completed ? colors.success : colors.border,
            backgroundColor: task.completed ? colors.success : 'transparent',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        {task.completed ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.text, textDecorationLine: task.completed ? 'line-through' : 'none' }]}>
          {task.title}
        </Text>
        {!compact && task.details ? (
          <Text style={[styles.details, { color: colors.textMuted }]} numberOfLines={2}>{task.details}</Text>
        ) : null}
        <View style={styles.metaRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Priority ${priorityLabels[task.priority]}. Tap to change.`}
            onPress={() => cyclePriority(task.id)}
            style={[styles.badge, { backgroundColor: `${priorityColor}22`, borderColor: priorityColor }]}
          >
            <Text style={[styles.badgeText, { color: priorityColor }]}>{priorityLabels[task.priority]}</Text>
          </Pressable>
          <Text style={[styles.meta, { color: colors.textMuted }]}>{task.category}</Text>
          {task.dueDay ? <Text style={[styles.meta, { color: colors.textMuted }]}>{task.dueDay}</Text> : null}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Delete ${task.title}`}
        onPress={() => Alert.alert('Delete task?', task.title, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
        ])}
        style={({ pressed }) => [styles.delete, { opacity: pressed ? 0.6 : 1, borderColor: 'transparent' }]}
      >
        <Text style={[styles.deleteText, { color: colors.danger }]}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 17 },
  body: { flex: 1, gap: spacing.xs },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 22 },
  details: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  badge: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  meta: { fontFamily: 'Inter_500Medium', fontSize: 12 },
  delete: { borderWidth: 2, padding: 4, borderRadius: 8 },
  deleteText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
});
