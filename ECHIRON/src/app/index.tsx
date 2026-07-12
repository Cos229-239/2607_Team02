import React from 'react';
import { AppShell } from '@/components/AppShell';
import { LoadingScreen } from '@/components/ui';
import { Onboarding } from '@/components/Onboarding';
import { useApp } from '@/context/AppContext';

export default function HomeScreen() {
  const { hydrated, data } = useApp();
  if (!hydrated) return <LoadingScreen />;
  if (!data.onboardingComplete || !data.profile) return <Onboarding />;
  return <AppShell />;
}
