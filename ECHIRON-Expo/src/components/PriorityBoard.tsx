import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { Priority } from '@/types/models';
import { Card, SectionTitle } from '@/components/ui';
import { TaskItem } from '@/components/TaskItem';

const sections: { priority: Priority; title: string; description: string }[] = [
  { priority: 'urgent', title: 'Do now', description: 'Time-sensitive and consequential.' },
  { priority: 'high', title: 'Protect next', description: 'Important work that deserves a place.' },
  { priority: 'medium', title: 'Schedule', description: 'Useful work with room to move.' },
  { priority: 'low', title: 'Release or revisit', description: 'Low-pressure items that should not crowd the day.' },
];

export function PriorityBoard() {
  const { colors, data } = useApp();
  const activeTasks = data.tasks.filter((task) => !task.completed);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>PRIORITY SORTING</Text>
        <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>Name what matters.</Text>
        <Text style={[styles.copy, { color: colors.textMuted }]}>Tap a priority label on any task to move it through the four levels.</Text>
      </View>

      {sections.map((section) => {
        const tasks = activeTasks.filter((task) => task.priority === section.priority);
        return (
          <View key={section.priority} style={styles.section}>
            <SectionTitle title={section.title} />
            <Text style={[styles.description, { color: colors.textMuted }]}>{section.description}</Text>
            <View style={styles.list}>
              {tasks.length ? tasks.map((task) => <TaskItem key={task.id} task={task} compact />) : (
                <Card>
                  <Text style={[styles.empty, { color: colors.textMuted }]}>No tasks in this lane.</Text>
                </Card>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: 120 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.4 },
  title: { fontFamily: 'Inter_800ExtraBold', fontSize: 30, marginTop: 5 },
  copy: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 5 },
  section: { gap: spacing.sm },
  description: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },
  list: { gap: spacing.md, marginTop: spacing.sm },
  empty: { fontFamily: 'Inter_500Medium', fontSize: 14 },
});
