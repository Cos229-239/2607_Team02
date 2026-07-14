import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { DayKey, Priority } from '@/types/models';
import { Chip, Field, PrimaryButton } from '@/components/ui';

const days: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const priorities: Priority[] = ['urgent', 'high', 'medium', 'low'];

export function QuickCaptureModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { colors, addTask } = useApp();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDay, setDueDay] = useState<DayKey | null>(null);
  const canSave = useMemo(() => title.trim().length >= 2, [title]);

  const save = () => {
    if (!canSave) return;

    addTask({
      title,
      details,
      category,
      priority,
      dueDay,
    });

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success,
    ).catch(() => undefined);

    setTitle('');
    setDetails('');
    setCategory('General');
    setPriority('medium');
    setDueDay(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.flex, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <Text
                  accessibilityRole="header"
                  style={[styles.title, { color: colors.text }]}
                >
                  Add a next action
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}> 
                  Give Echiron something worth noticing when you move it forward.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close action capture"
                onPress={onClose}
                style={styles.closeButton}
              >
                <Text style={[styles.closeText, { color: colors.primary }]}>Close</Text>
              </Pressable>
            </View>

            <Field
              label="Action or goal"
              value={title}
              onChangeText={setTitle}
              placeholder="What are you trying to move forward?"
              autoFocus
            />
            <Field
              label="Details"
              value={details}
              onChangeText={setDetails}
              placeholder="Add useful context"
              multiline
              style={{ minHeight: 96, textAlignVertical: 'top' }}
            />
            <Field
              label="Category"
              value={category}
              onChangeText={setCategory}
              placeholder="Health, school, work, personal…"
            />

            <View style={styles.group}>
              <Text style={[styles.groupLabel, { color: colors.text }]}>Priority</Text>
              <View style={styles.chipRow}>
                {priorities.map((item) => (
                  <Chip
                    key={item}
                    label={item[0].toUpperCase() + item.slice(1)}
                    selected={priority === item}
                    onPress={() => setPriority(item)}
                    tone={
                      item === 'urgent'
                        ? 'danger'
                        : item === 'high'
                          ? 'warning'
                          : item === 'medium'
                            ? 'secondary'
                            : 'primary'
                    }
                  />
                ))}
              </View>
            </View>

            <View style={styles.group}>
              <Text style={[styles.groupLabel, { color: colors.text }]}>Schedule</Text>
              <View style={styles.chipRow}>
                <Chip
                  label="Unscheduled"
                  selected={dueDay === null}
                  onPress={() => setDueDay(null)}
                />
                {days.map((day) => (
                  <Chip
                    key={day}
                    label={day}
                    selected={dueDay === day}
                    onPress={() => setDueDay(day)}
                  />
                ))}
              </View>
            </View>

            <PrimaryButton
              label="Add action"
              onPress={save}
              disabled={!canSave}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  headerCopy: { flex: 1 },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 28,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    maxWidth: 270,
  },
  closeButton: {
    minHeight: 44,
    minWidth: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  group: { gap: spacing.md },
  groupLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
