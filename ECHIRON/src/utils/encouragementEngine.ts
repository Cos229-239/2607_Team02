import {
  contextById,
  contextDefinitions,
  encouragementPrinciples,
  principleById,
  type EncouragementPrinciple,
  type EncouragementSignal,
} from '@/data/encouragementLibrary';
import type {
  AppData,
  EncouragementContext,
  EncouragementLength,
  EncouragementPreferences,
  EncouragementRecord,
  EncouragementSource,
  Priority,
  UserProfile,
} from '@/types/models';

export type CompletionSubject = {
  sourceType: EncouragementSource;
  sourceId: string;
  title: string;
  details: string;
  category: string;
  priority: Priority;
  createdAt: string;
};

export type EncouragementDraft = {
  context: EncouragementContext;
  principleId: string;
  principleTitle: string;
  messageId: string;
  heading: string;
  message: string;
};

export type LessonSummary = {
  principleId: string;
  title: string;
  summary: string;
  count: number;
  savedCount: number;
};

export type WeeklyReflection = {
  heading: string;
  message: string;
  completedCount: number;
  highPriorityCount: number;
  focusCount: number;
  dominantContextLabel: string | null;
};

export const defaultEncouragementPreferences: EncouragementPreferences = {
  tone: 'balanced',
  frequency: 'every',
  length: 'brief',
  usePreferredName: true,
  spiritualEnabled: false,
  animationsEnabled: true,
  pinnedPrincipleIds: [],
};

const stopWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'my',
  'of',
  'on',
  'or',
  'the',
  'to',
  'with',
  'your',
]);

export function normalizeEncouragementPreferences(
  preferences?: Partial<EncouragementPreferences> | null,
): EncouragementPreferences {
  return {
    ...defaultEncouragementPreferences,
    ...preferences,
    pinnedPrincipleIds: Array.isArray(preferences?.pinnedPrincipleIds)
      ? preferences.pinnedPrincipleIds
      : [],
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
}

function includesKeyword(text: string, keyword: string) {
  const normalizedKeyword = normalizeText(keyword).trim();
  if (!normalizedKeyword) return false;

  if (normalizedKeyword.includes(' ') || normalizedKeyword.includes('-')) {
    return text.includes(normalizedKeyword);
  }

  const tokens = new Set(text.split(/\s+/).filter(Boolean));
  return tokens.has(normalizedKeyword);
}

function meaningfulWords(value: string) {
  return new Set(
    normalizeText(value)
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word)),
  );
}

function classifyContext(
  subject: CompletionSubject,
  profile: UserProfile | null,
): EncouragementContext {
  const categoryText = normalizeText(subject.category);
  const titleText = normalizeText(subject.title);
  const detailsText = normalizeText(subject.details);
  const profileText = normalizeText(
    `${profile?.role ?? ''} ${profile?.goals ?? ''}`,
  );

  let bestContext: EncouragementContext = 'general';
  let bestScore = 0;

  contextDefinitions.forEach((definition) => {
    if (definition.id === 'general') return;

    let score = 0;
    definition.keywords.forEach((keyword) => {
      if (includesKeyword(categoryText, keyword)) score += 5;
      if (includesKeyword(titleText, keyword)) score += 3;
      if (includesKeyword(detailsText, keyword)) score += 1;
      if (includesKeyword(profileText, keyword)) score += 0.5;
    });

    if (score > bestScore) {
      bestScore = score;
      bestContext = definition.id;
    }
  });

  if (subject.sourceType === 'focus') return 'focus';
  return bestContext;
}

function isSameLocalDay(left: string | Date, right: string | Date) {
  return new Date(left).toDateString() === new Date(right).toDateString();
}

function hoursBetween(earlier: string, later: string) {
  return (
    (new Date(later).getTime() - new Date(earlier).getTime()) /
    (1000 * 60 * 60)
  );
}

function isGoalAligned(subject: CompletionSubject, profile: UserProfile | null) {
  if (!profile?.goals.trim()) return false;

  const subjectWords = meaningfulWords(
    `${subject.title} ${subject.details} ${subject.category}`,
  );
  const goalWords = meaningfulWords(profile.goals);

  for (const word of subjectWords) {
    if (goalWords.has(word)) return true;
  }

  return false;
}

function deriveSignals(
  subject: CompletionSubject,
  history: EncouragementRecord[],
  profile: UserProfile | null,
  completedAt: string,
): EncouragementSignal[] {
  const signals: EncouragementSignal[] = [];
  const completedBefore = history.length;

  if (subject.priority === 'urgent' || subject.priority === 'high') {
    signals.push('highPriority');
  }

  if (hoursBetween(subject.createdAt, completedAt) >= 72) {
    signals.push('delayed');
  }

  if (!history.some((record) => isSameLocalDay(record.createdAt, completedAt))) {
    signals.push('firstToday');
  }

  if ((completedBefore + 1) % 5 === 0) {
    signals.push('milestone');
  }

  const latest = history[0];
  if (latest && hoursBetween(latest.createdAt, completedAt) >= 48) {
    signals.push('returning');
  }

  if (isGoalAligned(subject, profile)) {
    signals.push('goalAligned');
  }

  if (subject.sourceType === 'focus') {
    signals.push('focused');
  }

  return signals;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0);
}

function scorePrinciple(
  principle: EncouragementPrinciple,
  context: EncouragementContext,
  signals: EncouragementSignal[],
  history: EncouragementRecord[],
  preferences: EncouragementPreferences,
) {
  let score = 0;

  if (principle.contexts.includes(context)) score += 7;
  if (principle.contexts.includes('general')) score += 1;

  signals.forEach((signal) => {
    if (principle.signals.includes(signal)) score += 4;
  });

  const savedForPrinciple = history.filter(
    (record) => record.saved && record.principleId === principle.id,
  ).length;
  const dismissedForPrinciple = history.filter(
    (record) => record.dismissed && record.principleId === principle.id,
  ).length;

  score += Math.min(savedForPrinciple, 3) * 1.5;
  score -= Math.min(dismissedForPrinciple, 3);

  if (preferences.pinnedPrincipleIds.includes(principle.id)) {
    score += 3;
  }

  return score;
}

function namePrefix(
  profile: UserProfile | null,
  preferences: EncouragementPreferences,
) {
  const name = profile?.preferredName.trim();

  if (
    !preferences.usePreferredName ||
    !name ||
    profile?.isGuest ||
    name.toLowerCase() === 'guest'
  ) {
    return '';
  }

  return `${name}, `;
}

function composeMessage(
  subject: CompletionSubject,
  principle: EncouragementPrinciple,
  context: EncouragementContext,
  leadIndex: number,
  length: EncouragementLength,
  profile: UserProfile | null,
  preferences: EncouragementPreferences,
  goalAligned: boolean,
) {
  const definition = contextById.get(context) ?? contextById.get('general')!;
  const lead = definition.leads[leadIndex % definition.leads.length];
  const prefix = namePrefix(profile, preferences);
  const namedLead = prefix
    ? `${prefix}${lead.charAt(0).toLowerCase()}${lead.slice(1)}`
    : lead;

  const parts = [namedLead, principle.tones[preferences.tone]];

  if (length === 'deeper') {
    parts.push(principle.summary);

    if (goalAligned) {
      parts.push(
        'This completion also supports a direction you named for yourself.',
      );
    }
  }

  return parts.join(' ');
}

export function generateEncouragement({
  subject,
  profile,
  history,
  preferences,
  completedAt,
  recentMessageIds,
  excludedMessageIds = [],
}: {
  subject: CompletionSubject;
  profile: UserProfile | null;
  history: EncouragementRecord[];
  preferences: EncouragementPreferences;
  completedAt: string;
  recentMessageIds: string[];
  excludedMessageIds?: string[];
}): EncouragementDraft {
  const context = classifyContext(subject, profile);
  const signals = deriveSignals(subject, history, profile, completedAt);
  const goalAligned = signals.includes('goalAligned');
  const allowedPrinciples = encouragementPrinciples.filter(
    (principle) => preferences.spiritualEnabled || !principle.spiritual,
  );

  const scored = allowedPrinciples
    .map((principle) => ({
      principle,
      score: scorePrinciple(
        principle,
        context,
        signals,
        history,
        preferences,
      ),
    }))
    .sort((left, right) => right.score - left.score);

  const topCandidates = scored.slice(0, Math.min(8, scored.length));
  const seed = hashString(
    `${subject.sourceId}:${completedAt}:${preferences.tone}:${history.length}`,
  );
  const blocked = new Set([
    ...recentMessageIds.slice(0, 10),
    ...excludedMessageIds,
  ]);

  let selectedPrinciple = topCandidates[0]?.principle ?? allowedPrinciples[0];
  let selectedLeadIndex = seed % 3;
  let selectedMessageId = '';

  for (let attempt = 0; attempt < topCandidates.length * 3; attempt += 1) {
    const candidate =
      topCandidates[(seed + attempt) % topCandidates.length]?.principle ??
      selectedPrinciple;
    const definition =
      contextById.get(context) ?? contextById.get('general')!;
    const leadIndex = (seed + attempt) % definition.leads.length;
    const messageId = [
      candidate.id,
      context,
      preferences.tone,
      preferences.length,
      leadIndex,
    ].join(':');

    selectedPrinciple = candidate;
    selectedLeadIndex = leadIndex;
    selectedMessageId = messageId;

    if (!blocked.has(messageId)) break;
  }

  const message = composeMessage(
    subject,
    selectedPrinciple,
    context,
    selectedLeadIndex,
    preferences.length,
    profile,
    preferences,
    goalAligned,
  );

  return {
    context,
    principleId: selectedPrinciple.id,
    principleTitle: selectedPrinciple.title,
    messageId: selectedMessageId,
    heading:
      subject.sourceType === 'focus'
        ? 'Focus block complete'
        : `Completed: ${subject.title}`,
    message,
  };
}

export function shouldSurfaceEncouragement({
  subject,
  preferences,
  history,
  completedAt,
}: {
  subject: CompletionSubject;
  preferences: EncouragementPreferences;
  history: EncouragementRecord[];
  completedAt: string;
}) {
  switch (preferences.frequency) {
    case 'every':
      return true;
    case 'important':
      return (
        subject.priority === 'urgent' ||
        subject.priority === 'high' ||
        hoursBetween(subject.createdAt, completedAt) >= 72
      );
    case 'firstDaily':
      return !history.some((record) =>
        isSameLocalDay(record.createdAt, completedAt),
      );
    case 'milestones':
      return (history.length + 1) % 5 === 0;
    case 'off':
      return false;
    default:
      return true;
  }
}

export function getLessonsEarned(
  history: EncouragementRecord[],
): LessonSummary[] {
  const counts = new Map<
    string,
    { count: number; savedCount: number }
  >();

  history.forEach((record) => {
    const current = counts.get(record.principleId) ?? {
      count: 0,
      savedCount: 0,
    };

    current.count += 1;
    if (record.saved) current.savedCount += 1;
    counts.set(record.principleId, current);
  });

  return [...counts.entries()]
    .map(([principleId, countData]) => {
      const principle = principleById.get(principleId);
      if (!principle) return null;

      return {
        principleId,
        title: principle.title,
        summary: principle.summary,
        ...countData,
      };
    })
    .filter((value): value is LessonSummary => value !== null)
    .sort((left, right) => {
      if (right.savedCount !== left.savedCount) {
        return right.savedCount - left.savedCount;
      }

      return right.count - left.count;
    });
}

export function getAvailablePrinciples(spiritualEnabled: boolean) {
  return encouragementPrinciples.filter(
    (principle) => spiritualEnabled || !principle.spiritual,
  );
}

export function buildWeeklyReflection(
  data: AppData,
  now = new Date(),
): WeeklyReflection {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);

  const recentRecords = data.encouragementHistory.filter(
    (record) => new Date(record.createdAt) >= cutoff,
  );
  const recentTasks = data.tasks.filter(
    (task) =>
      task.completedAt !== null && new Date(task.completedAt) >= cutoff,
  );
  const recentFocus = data.focusSessions.filter(
    (session) => new Date(session.startedAt) >= cutoff,
  );

  const completedCount = recentTasks.length;
  const highPriorityCount = recentTasks.filter(
    (task) => task.priority === 'urgent' || task.priority === 'high',
  ).length;
  const focusCount = recentFocus.length;

  const contextCounts = new Map<EncouragementContext, number>();
  recentRecords.forEach((record) => {
    contextCounts.set(
      record.context,
      (contextCounts.get(record.context) ?? 0) + 1,
    );
  });

  const dominantContext = [...contextCounts.entries()].sort(
    (left, right) => right[1] - left[1],
  )[0]?.[0];
  const dominantContextLabel = dominantContext
    ? contextById.get(dominantContext)?.label ?? null
    : null;

  if (completedCount === 0 && focusCount === 0) {
    return {
      heading: 'The week is still open',
      message:
        'No judgment is required here. Choose one honest next step, make it small enough to begin, and let action create the first evidence of movement.',
      completedCount,
      highPriorityCount,
      focusCount,
      dominantContextLabel,
    };
  }

  const parts = [
    `You completed ${completedCount} ${
      completedCount === 1 ? 'task' : 'tasks'
    } during the last seven days.`,
  ];

  if (highPriorityCount > 0) {
    parts.push(
      `${highPriorityCount} ${
        highPriorityCount === 1
          ? 'was a high-priority commitment'
          : 'were high-priority commitments'
      }.`,
    );
  }

  if (focusCount > 0) {
    parts.push(
      `You also protected ${focusCount} ${
        focusCount === 1 ? 'focus block' : 'focus blocks'
      }.`,
    );
  }

  if (dominantContextLabel) {
    parts.push(
      `Your strongest pattern of movement was in ${dominantContextLabel.toLowerCase()}.`,
    );
  }

  const returned = recentRecords.some(
    (record) => record.principleId === 'returning-beats-perfection',
  );

  if (returned) {
    parts.push(
      'The important pattern was not perfection; it was your willingness to return.',
    );
  } else {
    parts.push(
      'Progress did not need to be dramatic to remain real and useful.',
    );
  }

  return {
    heading: 'Evidence from your week',
    message: parts.join(' '),
    completedCount,
    highPriorityCount,
    focusCount,
    dominantContextLabel,
  };
}
