import type { ThemeMode } from '@/constants/theme';

export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type PlanningStyle = 'structured' | 'balanced' | 'flexible';
export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type EncouragementTone =
  | 'gentle'
  | 'balanced'
  | 'direct'
  | 'energetic'
  | 'reflective';

export type EncouragementFrequency =
  | 'every'
  | 'important'
  | 'firstDaily'
  | 'milestones'
  | 'off';

export type EncouragementLength = 'brief' | 'deeper';

export type EncouragementContext =
  | 'education'
  | 'work'
  | 'health'
  | 'family'
  | 'home'
  | 'creative'
  | 'finance'
  | 'growth'
  | 'focus'
  | 'planning'
  | 'recovery'
  | 'community'
  | 'caregiving'
  | 'transition'
  | 'courage'
  | 'general';

export type EncouragementSource = 'task' | 'focus';

export type EncouragementPreferences = {
  tone: EncouragementTone;
  frequency: EncouragementFrequency;
  length: EncouragementLength;
  usePreferredName: boolean;
  spiritualEnabled: boolean;
  animationsEnabled: boolean;
  pinnedPrincipleIds: string[];
};

export type EncouragementRecord = {
  id: string;
  sourceType: EncouragementSource;
  sourceId: string;
  subjectTitle: string;
  subjectDetails: string;
  subjectCategory: string;
  subjectPriority: Priority;
  subjectCreatedAt: string;
  context: EncouragementContext;
  principleId: string;
  principleTitle: string;
  principleSource?: string;
  principleSourceId?: string;
  matchedSignals?: string[];
  secondaryContext?: EncouragementContext | null;
  messageId: string;
  heading: string;
  message: string;
  createdAt: string;
  saved: boolean;
  dismissed: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  preferredName: string;
  email: string;
  role: string;
  timeZone: string;
  goals: string;
  planningStyle: PlanningStyle;
  notificationsEnabled: boolean;
  isGuest: boolean;
};

export type Task = {
  id: string;
  title: string;
  details: string;
  category: string;
  priority: Priority;
  dueDay: DayKey | null;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
};

export type FocusSession = {
  id: string;
  startedAt: string;
  minutes: number;
};

export type AppData = {
  profile: UserProfile | null;
  tasks: Task[];
  focusSessions: FocusSession[];
  themeMode: ThemeMode;
  onboardingComplete: boolean;
  encouragementPreferences: EncouragementPreferences;
  encouragementHistory: EncouragementRecord[];
  recentEncouragementMessageIds: string[];
};
