import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { AppColors, ThemeMode } from '@/constants/theme';
import { darkColors, lightColors } from '@/constants/theme';
import type {
  AppData,
  DayKey,
  EncouragementPreferences,
  EncouragementRecord,
  Priority,
  Task,
  UserProfile,
} from '@/types/models';
import { clearAppData, loadAppData, saveAppData } from '@/utils/storage';
import { createId } from '@/utils/id';
import {
  defaultEncouragementPreferences,
  generateEncouragement,
  normalizeEncouragementPreferences,
  shouldSurfaceEncouragement,
  type CompletionSubject,
} from '@/utils/encouragementEngine';

const initialTasks: Task[] = [
  {
    id: 'task_welcome_1',
    title: 'Choose one next good action',
    details: 'Pick one thing that would move your life forward today.',
    category: 'Growth',
    priority: 'high',
    dueDay: 'Mon',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: 'task_welcome_2',
    title: 'Complete one focused work block',
    details:
      'Protect 25 minutes for something worth moving forward.',
    category: 'Focus',
    priority: 'medium',
    dueDay: 'Mon',
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
];

const initialData: AppData = {
  profile: null,
  tasks: initialTasks,
  focusSessions: [],
  themeMode: 'system',
  onboardingComplete: false,
  encouragementPreferences: defaultEncouragementPreferences,
  encouragementHistory: [],
  recentEncouragementMessageIds: [],
};

type NewTaskInput = {
  title: string;
  details: string;
  category: string;
  priority: Priority;
  dueDay: DayKey | null;
};

type AppContextValue = {
  data: AppData;
  colors: AppColors;
  resolvedTheme: 'light' | 'dark';
  hydrated: boolean;
  activeEncouragement: EncouragementRecord | null;
  createProfile: (profile: Omit<UserProfile, 'id' | 'isGuest'>) => void;
  continueAsGuest: () => void;
  addTask: (input: NewTaskInput) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  cyclePriority: (taskId: string) => void;
  assignTaskDay: (taskId: string, day: DayKey | null) => void;
  recordFocusSession: (minutes: number) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setEncouragementPreferences: (
    patch: Partial<EncouragementPreferences>,
  ) => void;
  saveActiveEncouragement: () => void;
  dismissActiveEncouragement: () => void;
  requestAnotherEncouragement: () => void;
  toggleSavedEncouragement: (recordId: string) => void;
  togglePinnedPrinciple: (principleId: string) => void;
  resetApp: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

function normalizeLoadedData(saved: AppData): AppData {
  return {
    ...initialData,
    ...saved,
    tasks: Array.isArray(saved.tasks) ? saved.tasks : initialTasks,
    focusSessions: Array.isArray(saved.focusSessions)
      ? saved.focusSessions
      : [],
    encouragementPreferences: normalizeEncouragementPreferences(
      saved.encouragementPreferences,
    ),
    encouragementHistory: Array.isArray(saved.encouragementHistory)
      ? saved.encouragementHistory
      : [],
    recentEncouragementMessageIds: Array.isArray(
      saved.recentEncouragementMessageIds,
    )
      ? saved.recentEncouragementMessageIds
      : [],
  };
}

function createEncouragementRecord(
  subject: CompletionSubject,
  completedAt: string,
  draft: ReturnType<typeof generateEncouragement>,
): EncouragementRecord {
  return {
    id: createId('encouragement'),
    sourceType: subject.sourceType,
    sourceId: subject.sourceId,
    subjectTitle: subject.title,
    subjectDetails: subject.details,
    subjectCategory: subject.category,
    subjectPriority: subject.priority,
    subjectCreatedAt: subject.createdAt,
    context: draft.context,
    principleId: draft.principleId,
    principleTitle: draft.principleTitle,
    messageId: draft.messageId,
    heading: draft.heading,
    message: draft.message,
    createdAt: completedAt,
    saved: false,
    dismissed: false,
  };
}

function addRecentMessage(
  current: string[],
  messageId: string,
): string[] {
  return [
    messageId,
    ...current.filter((value) => value !== messageId),
  ].slice(0, 12);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [activeEncouragement, setActiveEncouragement] =
    useState<EncouragementRecord | null>(null);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );

  useEffect(() => {
    let active = true;

    loadAppData()
      .then((saved) => {
        if (active && saved) {
          setData(normalizeLoadedData(saved));
        }
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAppData(data).catch(() => undefined);
  }, [data, hydrated]);

  const resolvedTheme =
    data.themeMode === 'system' ? systemTheme : data.themeMode;
  const colors = resolvedTheme === 'dark' ? darkColors : lightColors;

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      colors,
      resolvedTheme,
      hydrated,
      activeEncouragement,
      createProfile: (profile) => {
        setData((current) => ({
          ...current,
          profile: {
            ...profile,
            id: createId('profile'),
            isGuest: false,
          },
          onboardingComplete: true,
        }));
      },
      continueAsGuest: () => {
        setData((current) => ({
          ...current,
          profile: {
            id: createId('guest'),
            name: 'Guest',
            preferredName: 'Guest',
            email: '',
            role: 'Independent person',
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            goals:
              'Build momentum, recognize progress, and keep moving toward what matters.',
            planningStyle: 'balanced',
            notificationsEnabled: false,
            isGuest: true,
          },
          onboardingComplete: true,
        }));
      },
      addTask: (input) => {
        const task: Task = {
          id: createId('task'),
          ...input,
          title: input.title.trim(),
          details: input.details.trim(),
          category: input.category.trim() || 'General',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };

        setData((current) => ({
          ...current,
          tasks: [task, ...current.tasks],
        }));
      },
      toggleTask: (taskId) => {
        const task = data.tasks.find((item) => item.id === taskId);
        if (!task) return;

        if (task.completed) {
          setData((current) => ({
            ...current,
            tasks: current.tasks.map((item) =>
              item.id === taskId
                ? {
                    ...item,
                    completed: false,
                    completedAt: null,
                  }
                : item,
            ),
          }));

          if (
            activeEncouragement?.sourceType === 'task' &&
            activeEncouragement.sourceId === taskId
          ) {
            setActiveEncouragement(null);
          }

          return;
        }

        const completedAt = new Date().toISOString();
        const subject: CompletionSubject = {
          sourceType: 'task',
          sourceId: task.id,
          title: task.title,
          details: task.details,
          category: task.category,
          priority: task.priority,
          createdAt: task.createdAt,
        };
        const draft = generateEncouragement({
          subject,
          profile: data.profile,
          history: data.encouragementHistory,
          preferences: data.encouragementPreferences,
          completedAt,
          recentMessageIds: data.recentEncouragementMessageIds,
        });
        const record = createEncouragementRecord(
          subject,
          completedAt,
          draft,
        );
        const shouldShow = shouldSurfaceEncouragement({
          subject,
          preferences: data.encouragementPreferences,
          history: data.encouragementHistory,
          completedAt,
        });

        setData((current) => ({
          ...current,
          tasks: current.tasks.map((item) =>
            item.id === taskId
              ? {
                  ...item,
                  completed: true,
                  completedAt,
                }
              : item,
          ),
          encouragementHistory: [
            record,
            ...current.encouragementHistory,
          ].slice(0, 300),
          recentEncouragementMessageIds: addRecentMessage(
            current.recentEncouragementMessageIds,
            record.messageId,
          ),
        }));

        if (shouldShow) {
          setActiveEncouragement(record);
        }

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      },
      deleteTask: (taskId) => {
        setData((current) => ({
          ...current,
          tasks: current.tasks.filter((task) => task.id !== taskId),
        }));
      },
      cyclePriority: (taskId) => {
        const order: Priority[] = ['low', 'medium', 'high', 'urgent'];

        setData((current) => ({
          ...current,
          tasks: current.tasks.map((task) => {
            if (task.id !== taskId) return task;
            const index = order.indexOf(task.priority);

            return {
              ...task,
              priority: order[(index + 1) % order.length],
            };
          }),
        }));
      },
      assignTaskDay: (taskId, day) => {
        setData((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === taskId ? { ...task, dueDay: day } : task,
          ),
        }));
      },
      recordFocusSession: (minutes) => {
        const startedAt = new Date().toISOString();
        const sessionId = createId('focus');
        const subject: CompletionSubject = {
          sourceType: 'focus',
          sourceId: sessionId,
          title: `${minutes}-minute focus block`,
          details:
            'A protected block of focused, distraction-limited work.',
          category: 'Focus',
          priority: 'medium',
          createdAt: startedAt,
        };
        const draft = generateEncouragement({
          subject,
          profile: data.profile,
          history: data.encouragementHistory,
          preferences: data.encouragementPreferences,
          completedAt: startedAt,
          recentMessageIds: data.recentEncouragementMessageIds,
        });
        const record = createEncouragementRecord(
          subject,
          startedAt,
          draft,
        );
        const shouldShow = shouldSurfaceEncouragement({
          subject,
          preferences: data.encouragementPreferences,
          history: data.encouragementHistory,
          completedAt: startedAt,
        });

        setData((current) => ({
          ...current,
          focusSessions: [
            {
              id: sessionId,
              startedAt,
              minutes,
            },
            ...current.focusSessions,
          ],
          encouragementHistory: [
            record,
            ...current.encouragementHistory,
          ].slice(0, 300),
          recentEncouragementMessageIds: addRecentMessage(
            current.recentEncouragementMessageIds,
            record.messageId,
          ),
        }));

        if (shouldShow) {
          setActiveEncouragement(record);
        }

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      },
      setThemeMode: (themeMode) => {
        setData((current) => ({
          ...current,
          themeMode,
        }));
      },
      setEncouragementPreferences: (patch) => {
        setData((current) => ({
          ...current,
          encouragementPreferences: {
            ...current.encouragementPreferences,
            ...patch,
          },
        }));

        if (patch.frequency === 'off') {
          setActiveEncouragement(null);
        }
      },
      saveActiveEncouragement: () => {
        if (!activeEncouragement) return;

        const updated = {
          ...activeEncouragement,
          saved: true,
          dismissed: false,
        };

        setActiveEncouragement(updated);
        setData((current) => ({
          ...current,
          encouragementHistory: current.encouragementHistory.map((record) =>
            record.id === updated.id ? updated : record,
          ),
        }));
      },
      dismissActiveEncouragement: () => {
        if (!activeEncouragement) return;

        const recordId = activeEncouragement.id;
        setActiveEncouragement(null);
        setData((current) => ({
          ...current,
          encouragementHistory: current.encouragementHistory.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  dismissed: true,
                  saved: false,
                }
              : record,
          ),
        }));
      },
      requestAnotherEncouragement: () => {
        if (!activeEncouragement) return;

        const subject: CompletionSubject = {
          sourceType: activeEncouragement.sourceType,
          sourceId: activeEncouragement.sourceId,
          title: activeEncouragement.subjectTitle,
          details: activeEncouragement.subjectDetails,
          category: activeEncouragement.subjectCategory,
          priority: activeEncouragement.subjectPriority,
          createdAt: activeEncouragement.subjectCreatedAt,
        };
        const draft = generateEncouragement({
          subject,
          profile: data.profile,
          history: data.encouragementHistory,
          preferences: data.encouragementPreferences,
          completedAt: activeEncouragement.createdAt,
          recentMessageIds: data.recentEncouragementMessageIds,
          excludedMessageIds: [activeEncouragement.messageId],
        });
        const updated: EncouragementRecord = {
          ...activeEncouragement,
          context: draft.context,
          principleId: draft.principleId,
          principleTitle: draft.principleTitle,
          messageId: draft.messageId,
          heading: draft.heading,
          message: draft.message,
          saved: false,
          dismissed: false,
        };

        setActiveEncouragement(updated);
        setData((current) => ({
          ...current,
          encouragementHistory: current.encouragementHistory.map((record) =>
            record.id === updated.id ? updated : record,
          ),
          recentEncouragementMessageIds: addRecentMessage(
            current.recentEncouragementMessageIds,
            updated.messageId,
          ),
        }));
      },
      toggleSavedEncouragement: (recordId) => {
        setData((current) => ({
          ...current,
          encouragementHistory: current.encouragementHistory.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  saved: !record.saved,
                  dismissed: false,
                }
              : record,
          ),
        }));

        if (activeEncouragement?.id === recordId) {
          setActiveEncouragement({
            ...activeEncouragement,
            saved: !activeEncouragement.saved,
            dismissed: false,
          });
        }
      },
      togglePinnedPrinciple: (principleId) => {
        setData((current) => {
          const pinned = current.encouragementPreferences.pinnedPrincipleIds;
          const nextPinned = pinned.includes(principleId)
            ? pinned.filter((id) => id !== principleId)
            : [...pinned, principleId];

          return {
            ...current,
            encouragementPreferences: {
              ...current.encouragementPreferences,
              pinnedPrincipleIds: nextPinned,
            },
          };
        });
      },
      resetApp: async () => {
        await clearAppData();
        setActiveEncouragement(null);
        setData(initialData);
      },
    }),
    [
      activeEncouragement,
      colors,
      data,
      hydrated,
      resolvedTheme,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}
