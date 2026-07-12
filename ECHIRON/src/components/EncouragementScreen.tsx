import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import {
  buildWeeklyReflection,
  getAvailablePrinciples,
  getLessonsEarned,
} from '@/utils/encouragementEngine';
import type {
  EncouragementFrequency,
  EncouragementLength,
  EncouragementTone,
} from '@/types/models';
import { Card, Chip, PrimaryButton, SectionTitle } from '@/components/ui';

const toneOptions: { value: EncouragementTone; label: string }[] = [
  { value: 'gentle', label: 'Gentle' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'direct', label: 'Direct' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'reflective', label: 'Reflective' },
];

const frequencyOptions: {
  value: EncouragementFrequency;
  label: string;
}[] = [
  { value: 'every', label: 'Every completion' },
  { value: 'important', label: 'Important tasks' },
  { value: 'firstDaily', label: 'First each day' },
  { value: 'milestones', label: 'Milestones' },
  { value: 'off', label: 'No popups' },
];

const lengthOptions: {
  value: EncouragementLength;
  label: string;
}[] = [
  { value: 'brief', label: 'Brief' },
  { value: 'deeper', label: 'Deeper' },
];

export function EncouragementScreen() {
  const {
    colors,
    data,
    setEncouragementPreferences,
    toggleSavedEncouragement,
    togglePinnedPrinciple,
  } = useApp();
  const [showAllPrinciples, setShowAllPrinciples] = useState(false);
  const preferences = data.encouragementPreferences;

  const weeklyReflection = useMemo(
    () => buildWeeklyReflection(data),
    [data],
  );
  const lessons = useMemo(
    () => getLessonsEarned(data.encouragementHistory),
    [data.encouragementHistory],
  );
  const recentWins = data.encouragementHistory
    .filter((record) => !record.dismissed)
    .slice(0, 6);
  const saved = data.encouragementHistory.filter(
    (record) => record.saved,
  );
  const today = new Date().toDateString();
  const todayRecord =
    data.encouragementHistory.find(
      (record) =>
        !record.dismissed &&
        new Date(record.createdAt).toDateString() === today,
    ) ?? data.encouragementHistory.find((record) => !record.dismissed);
  const dismissedCount = data.encouragementHistory.filter(
    (record) => record.dismissed,
  ).length;

  const principles = useMemo(() => {
    const available = getAvailablePrinciples(
      preferences.spiritualEnabled,
    );

    return [...available].sort((left, right) => {
      const leftPinned = preferences.pinnedPrincipleIds.includes(
        left.id,
      );
      const rightPinned = preferences.pinnedPrincipleIds.includes(
        right.id,
      );

      if (leftPinned !== rightPinned) {
        return leftPinned ? -1 : 1;
      }

      return left.title.localeCompare(right.title);
    });
  }, [
    preferences.pinnedPrincipleIds,
    preferences.spiritualEnabled,
  ]);

  const visiblePrinciples = showAllPrinciples
    ? principles
    : principles.slice(0, 7);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.secondary }]}>ENCOURAGEMENT</Text>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.text }]}
        >
          Progress with meaning.
        </Text>
        <Text style={[styles.copy, { color: colors.textMuted }]}> 
          Echiron recognizes the effort and direction behind a completed action—not just that a checkbox changed.
        </Text>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Today’s encouragement" />
        <Card style={styles.heroCard}>
          <Text style={[styles.heroTitle, { color: colors.text }]}> 
            {todayRecord?.principleTitle ?? 'Begin with one honest step'}
          </Text>
          <Text style={[styles.heroMessage, { color: colors.textMuted }]}> 
            {todayRecord?.message ??
              'You do not need to complete everything before progress becomes real. Choose one useful action, finish it, and let that evidence guide the next step.'}
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Weekly reflection" />
        <Card style={styles.reflectionCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}> 
            {weeklyReflection.heading}
          </Text>
          <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
            {weeklyReflection.message}
          </Text>
          <View style={styles.statRow}>
            <MiniStat label="Tasks" value={`${weeklyReflection.completedCount}`} />
            <MiniStat label="High priority" value={`${weeklyReflection.highPriorityCount}`} />
            <MiniStat label="Focus blocks" value={`${weeklyReflection.focusCount}`} />
          </View>
        </Card>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Recent wins" />
        {recentWins.length ? (
          <View style={styles.list}>
            {recentWins.map((record) => (
              <Card key={record.id} style={styles.winCard}>
                <View style={styles.winTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.winTitle, { color: colors.text }]}> 
                      {record.subjectTitle}
                    </Text>
                    <Text style={[styles.winMeta, { color: colors.secondary }]}> 
                      {record.principleTitle}
                    </Text>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      record.saved
                        ? 'Remove saved encouragement'
                        : 'Save encouragement'
                    }
                    onPress={() => toggleSavedEncouragement(record.id)}
                    style={({ pressed }) => [
                      styles.saveButton,
                      {
                        borderColor: record.saved ? colors.primary : colors.border,
                        backgroundColor: record.saved ? colors.surfaceAlt : 'transparent',
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.saveText,
                        {
                          color: record.saved ? colors.primary : colors.textMuted,
                        },
                      ]}
                    >
                      {record.saved ? 'Saved' : 'Save'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={[styles.winMessage, { color: colors.textMuted }]}> 
                  {record.message}
                </Text>
                <Text style={[styles.dateText, { color: colors.textMuted }]}> 
                  {new Date(record.createdAt).toLocaleDateString()}
                </Text>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
              Completed tasks and focus blocks will appear here as evidence of movement.
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Lessons earned" />
        {lessons.length ? (
          <View style={styles.list}>
            {lessons.slice(0, 6).map((lesson) => (
              <Card key={lesson.principleId}>
                <View style={styles.lessonHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text, flex: 1 }]}> 
                    {lesson.title}
                  </Text>
                  <Text style={[styles.lessonCount, { color: colors.secondary }]}> 
                    {lesson.count}×
                  </Text>
                </View>
                <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
                  {lesson.summary}
                </Text>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
              Lessons will gather here as completed actions reveal patterns in your progress.
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Saved encouragements" />
        {saved.length ? (
          <View style={styles.list}>
            {saved.slice(0, 10).map((record) => (
              <Card key={record.id}>
                <Text style={[styles.cardTitle, { color: colors.text }]}> 
                  {record.principleTitle}
                </Text>
                <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
                  {record.message}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove from saved encouragements"
                  onPress={() => toggleSavedEncouragement(record.id)}
                  style={styles.textAction}
                >
                  <Text style={[styles.textActionLabel, { color: colors.primary }]}> 
                    Remove from saved
                  </Text>
                </Pressable>
              </Card>
            ))}
          </View>
        ) : (
          <Card>
            <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
              Save messages that you want to revisit. Saved and dismissed feedback also helps the local engine choose better principles.
            </Text>
          </Card>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Personal principles" />
        <Text style={[styles.sectionCopy, { color: colors.textMuted }]}> 
          Keep principles that you want Echiron to favor when more than one lesson fits.
        </Text>
        <View style={styles.list}>
          {visiblePrinciples.map((principle) => {
            const pinned = preferences.pinnedPrincipleIds.includes(principle.id);

            return (
              <Card key={principle.id} style={styles.principleCard}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}> 
                    {principle.title}
                  </Text>
                  <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
                    {principle.summary}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: pinned }}
                  accessibilityLabel={
                    pinned
                      ? `Remove ${principle.title} from personal principles`
                      : `Keep ${principle.title} as a personal principle`
                  }
                  onPress={() => togglePinnedPrinciple(principle.id)}
                  style={({ pressed }) => [
                    styles.keepButton,
                    {
                      backgroundColor: pinned ? colors.primary : colors.surfaceAlt,
                      borderColor: pinned ? colors.primary : colors.border,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.keepText, { color: pinned ? '#FFFFFF' : colors.text }]}> 
                    {pinned ? 'Kept' : 'Keep'}
                  </Text>
                </Pressable>
              </Card>
            );
          })}
        </View>
        {principles.length > 7 ? (
          <PrimaryButton
            label={showAllPrinciples ? 'Show fewer principles' : 'Explore all principles'}
            variant="ghost"
            onPress={() => setShowAllPrinciples((current) => !current)}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Encouragement preferences" />

        <Card style={styles.preferenceCard}>
          <PreferenceLabel
            title="Voice"
            copy="Choose how Echiron delivers the same grounded lesson."
          />
          <View style={styles.chips}>
            {toneOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={preferences.tone === option.value}
                onPress={() => setEncouragementPreferences({ tone: option.value })}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.preferenceCard}>
          <PreferenceLabel
            title="Completion messages"
            copy="The engine still records wins locally when popups are reduced or turned off."
          />
          <View style={styles.chips}>
            {frequencyOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={preferences.frequency === option.value}
                onPress={() => setEncouragementPreferences({ frequency: option.value })}
              />
            ))}
          </View>
        </Card>

        <Card style={styles.preferenceCard}>
          <PreferenceLabel
            title="Message depth"
            copy="Brief messages stay compact. Deeper messages include the principle behind the encouragement."
          />
          <View style={styles.chips}>
            {lengthOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={preferences.length === option.value}
                onPress={() => setEncouragementPreferences({ length: option.value })}
              />
            ))}
          </View>
        </Card>

        <PreferenceSwitch
          title="Use my preferred name"
          copy="Adds the preferred name from the local profile when it fits naturally."
          value={preferences.usePreferredName}
          onValueChange={(value) =>
            setEncouragementPreferences({ usePreferredName: value })
          }
        />

        <PreferenceSwitch
          title="Spiritual encouragement"
          copy="Adds optional faith, grace, service, and spiritual-purpose principles. This is off by default."
          value={preferences.spiritualEnabled}
          onValueChange={(value) =>
            setEncouragementPreferences({ spiritualEnabled: value })
          }
        />

        <PreferenceSwitch
          title="Completion animation"
          copy="Animates the encouragement card above the navigation after a completion."
          value={preferences.animationsEnabled}
          onValueChange={(value) =>
            setEncouragementPreferences({ animationsEnabled: value })
          }
        />

        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Local learning</Text>
          <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
            {saved.length} saved and {dismissedCount} dismissed messages currently guide repetition avoidance and principle matching. All encouragement data remains on this device.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { colors } = useApp();

  return (
    <View
      style={[
        styles.miniStat,
        {
          backgroundColor: colors.surfaceAlt,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.miniValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.miniLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function PreferenceLabel({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  const { colors } = useApp();

  return (
    <View>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.cardCopy, { color: colors.textMuted }]}>{copy}</Text>
    </View>
  );
}

function PreferenceSwitch({
  title,
  copy,
  value,
  onValueChange,
}: {
  title: string;
  copy: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { colors } = useApp();

  return (
    <Card style={styles.switchCard}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.cardCopy, { color: colors.textMuted }]}>{copy}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingBottom: 140,
  },
  eyebrow: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
    lineHeight: 37,
    marginTop: 5,
  },
  copy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
  },
  section: { gap: spacing.md },
  sectionCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: -4,
  },
  list: { gap: spacing.md },
  heroCard: {
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  heroTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 21,
  },
  heroMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  reflectionCard: { gap: spacing.md },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  cardCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  miniStat: {
    flexGrow: 1,
    minWidth: 92,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  miniValue: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 21,
  },
  miniLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginTop: 2,
  },
  winCard: { gap: spacing.sm },
  winTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  winTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    lineHeight: 21,
  },
  winMeta: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginTop: 3,
  },
  winMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
  },
  dateText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  saveButton: {
    minHeight: 38,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  lessonCount: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 18,
  },
  textAction: {
    alignSelf: 'flex-start',
    minHeight: 40,
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  textActionLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  principleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  keepButton: {
    minHeight: 42,
    minWidth: 64,
    borderWidth: 1,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  keepText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  preferenceCard: { gap: spacing.md },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
