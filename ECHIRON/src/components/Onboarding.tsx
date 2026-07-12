import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, spacing } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import type { PlanningStyle } from '@/types/models';
import { Card, Chip, Field, PrimaryButton } from '@/components/ui';

export function Onboarding() {
  const { colors, createProfile, continueAsGuest } = useApp();
  const [mode, setMode] = useState<'welcome' | 'profile'>('welcome');
  const [name, setName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [goals, setGoals] = useState('');
  const [planningStyle, setPlanningStyle] =
    useState<PlanningStyle>('balanced');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  if (mode === 'welcome') {
    return (
      <SafeAreaView
        edges={['top', 'bottom']}
        style={[styles.safe, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.welcomeContent}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.logo}
            accessibilityLabel="Echiron logo"
          >
            <Text style={styles.logoMark}>E</Text>
          </LinearGradient>

          <Text
            accessibilityRole="header"
            style={[styles.brand, { color: colors.text }]}
          >
            Echiron
          </Text>

          <Text style={[styles.tagline, { color: colors.textMuted }]}> 
            Not built to replace you. Built to stand beside you.
          </Text>

          <Card style={styles.valueCard}>
            <Text style={[styles.cardTitle, { color: colors.text }]}> 
              Progress deserves to be seen
            </Text>
            <Text style={[styles.cardCopy, { color: colors.textMuted }]}> 
              Track the next good choice, recognize the effort behind it, and
              turn small wins into momentum without surrendering your data.
            </Text>
            <View style={styles.featureList}>
              {[
                'Human-first encouragement',
                'Progress without punishment',
                'Local-first privacy',
                'No ads and no account required',
              ].map((item) => (
                <View key={item} style={styles.featureRow}>
                  <Text style={[styles.checkIcon, { color: colors.success }]}> 
                    ✓
                  </Text>
                  <Text style={[styles.featureText, { color: colors.text }]}> 
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          <View style={styles.buttonStack}>
            <PrimaryButton
              label="Create my profile"
              onPress={() => setMode('profile')}
            />
            <PrimaryButton
              label="Continue as guest"
              variant="ghost"
              onPress={continueAsGuest}
            />
          </View>

          <Text style={[styles.privacyNote, { color: colors.textMuted }]}> 
            Your profile and progress stay on this device in this release.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const canSave = name.trim().length >= 2 && role.trim().length >= 2;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            accessibilityRole="header"
            style={[styles.formTitle, { color: colors.text }]}
          >
            Create your profile
          </Text>
          <Text style={[styles.formSubtitle, { color: colors.textMuted }]}> 
            Echiron adapts its encouragement and planning rhythm to you.
          </Text>

          <Field
            label="Full name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          <Field
            label="Preferred name"
            value={preferredName}
            onChangeText={setPreferredName}
            placeholder="What should Echiron call you?"
          />
          <Field
            label="Email (optional)"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            label="Role"
            value={role}
            onChangeText={setRole}
            placeholder="Student, parent, professional…"
          />
          <Field
            label="Primary goals"
            value={goals}
            onChangeText={setGoals}
            placeholder="What are you trying to move forward?"
            multiline
            style={{ minHeight: 96, textAlignVertical: 'top' }}
          />

          <View style={styles.group}>
            <Text style={[styles.label, { color: colors.text }]}> 
              Planning style
            </Text>
            <View style={styles.chips}>
              {(
                ['structured', 'balanced', 'flexible'] as PlanningStyle[]
              ).map((style) => (
                <Chip
                  key={style}
                  label={style[0].toUpperCase() + style.slice(1)}
                  selected={planningStyle === style}
                  onPress={() => setPlanningStyle(style)}
                />
              ))}
            </View>
          </View>

          <View
            style={[
              styles.switchRow,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.switchTitle, { color: colors.text }]}> 
                Progress reminders
              </Text>
              <Text style={[styles.switchCopy, { color: colors.textMuted }]}> 
                Store your preference now. Device notifications can be
                enabled in a later release.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: colors.primary }}
            />
          </View>

          <PrimaryButton
            label="Enter Echiron"
            disabled={!canSave}
            onPress={() =>
              createProfile({
                name: name.trim(),
                preferredName:
                  preferredName.trim() || name.trim().split(' ')[0],
                email: email.trim(),
                role: role.trim(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                goals: goals.trim(),
                planningStyle,
                notificationsEnabled,
              })
            }
          />
          <PrimaryButton
            label="Back"
            variant="ghost"
            onPress={() => setMode('welcome')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  welcomeContent: {
    flexGrow: 1,
    padding: spacing.xl,
    paddingTop: 48,
    paddingBottom: 48,
    gap: spacing.lg,
    alignItems: 'center',
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    color: '#FFFFFF',
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 50,
  },
  brand: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 36,
    marginTop: spacing.sm,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 17,
    textAlign: 'center',
  },
  valueCard: {
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
  },
  cardCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  featureList: { gap: spacing.sm },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkIcon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
  },
  featureText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  buttonStack: { width: '100%', gap: spacing.md },
  privacyNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 300,
  },
  formContent: {
    padding: spacing.xl,
    paddingTop: 40,
    paddingBottom: 48,
    gap: spacing.xl,
  },
  formTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 30,
  },
  formSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    marginTop: -12,
  },
  group: { gap: spacing.md },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  switchTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  switchCopy: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
});
