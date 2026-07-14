import {
  contextBridges,
  nameOpeners,
  planningClosings,
  signalEvidence,
  toneClosings,
} from '@/data/encouragementGrammar';
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
  EncouragementPreferences,
  EncouragementRecord,
  EncouragementSource,
  EncouragementTone,
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
  secondaryContext: EncouragementContext | null;
  principleId: string;
  principleTitle: string;
  principleSource: string;
  principleSourceId: string;
  matchedSignals: EncouragementSignal[];
  messageId: string;
  heading: string;
  message: string;
};

export type LessonSummary = {
  principleId: string;
  title: string;
  sourceLabel: string;
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

export type EncouragementInventory = {
  principles: number;
  sources: number;
  contexts: number;
  contextLeads: number;
  principleTonePhrases: number;
  signalEvidencePhrases: number;
  closingPhrases: number;
  conservativeBaseCombinations: number;
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
  'about', 'after', 'again', 'also', 'and', 'are', 'because', 'been', 'being',
  'but', 'can', 'could', 'did', 'does', 'for', 'from', 'had', 'has', 'have',
  'into', 'its', 'more', 'not', 'only', 'that', 'the', 'their', 'them', 'then',
  'there', 'these', 'they', 'this', 'through', 'too', 'was', 'were', 'what',
  'when', 'where', 'which', 'while', 'will', 'with', 'would', 'your',
]);

const uncertainKeywords = [
  'afraid', 'anxious', 'avoid', 'conflict', 'decide', 'difficult', 'doubt',
  'fear', 'finally', 'hard', 'maybe', 'nervous', 'stuck', 'unsure', 'worry',
];
const restorativeKeywords = [
  'break', 'doctor', 'exercise', 'heal', 'health', 'meal', 'medication',
  'pause', 'recover', 'rest', 'sleep', 'stretch', 'walk', 'water', 'workout',
];
const foundationKeywords = [
  'budget', 'calendar', 'clean', 'foundation', 'maintenance', 'organize',
  'plan', 'prepare', 'schedule', 'setup', 'system', 'tax',
];
const sharedKeywords = [
  'care', 'child', 'client', 'community', 'family', 'friend', 'help', 'neighbor',
  'partner', 'support', 'team', 'together', 'volunteer',
];
const practiceKeywords = [
  'again', 'daily', 'habit', 'practice', 'repeat', 'routine', 'session', 'weekly',
];

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
  return value.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function includesKeyword(text: string, keyword: string) {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return false;
  if (normalizedKeyword.includes(' ') || normalizedKeyword.includes('-')) {
    return text.includes(normalizedKeyword);
  }
  return new Set(text.split(/\s+/).filter(Boolean)).has(normalizedKeyword);
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => includesKeyword(text, keyword));
}

function meaningfulWords(value: string) {
  return new Set(
    normalizeText(value)
      .split(/\s+/)
      .filter((word) => word.length >= 4 && !stopWords.has(word)),
  );
}

type ContextMatch = {
  primary: EncouragementContext;
  secondary: EncouragementContext | null;
  scores: Map<EncouragementContext, number>;
};

export function classifyEncouragementContexts(
  subject: CompletionSubject,
  profile: UserProfile | null,
): ContextMatch {
  const categoryText = normalizeText(subject.category);
  const titleText = normalizeText(subject.title);
  const detailsText = normalizeText(subject.details);
  const profileText = normalizeText(`${profile?.role ?? ''} ${profile?.goals ?? ''}`);
  const scores = new Map<EncouragementContext, number>();

  contextDefinitions.forEach((definition) => {
    if (definition.id === 'general') return;
    let score = 0;
    if (categoryText === normalizeText(definition.label)) score += 8;
    definition.keywords.forEach((keyword) => {
      if (includesKeyword(categoryText, keyword)) score += 5;
      if (includesKeyword(titleText, keyword)) score += 3;
      if (includesKeyword(detailsText, keyword)) score += 1.5;
      if (includesKeyword(profileText, keyword)) score += 0.4;
    });
    scores.set(definition.id, score);
  });

  if (subject.sourceType === 'focus') {
    scores.set('focus', (scores.get('focus') ?? 0) + 100);
  }

  const ranked = [...scores.entries()]
    .filter(([, score]) => score > 0)
    .sort((left, right) => right[1] - left[1]);
  const primary = ranked[0]?.[0] ?? 'general';
  const secondaryCandidate = ranked.find(
    ([context, score]) => context !== primary && score >= Math.max(3, (ranked[0]?.[1] ?? 0) * 0.22),
  );

  return {
    primary,
    secondary: secondaryCandidate?.[0] ?? null,
    scores,
  };
}

function isSameLocalDay(left: string | Date, right: string | Date) {
  return new Date(left).toDateString() === new Date(right).toDateString();
}

function hoursBetween(earlier: string, later: string) {
  return Math.max(
    0,
    (new Date(later).getTime() - new Date(earlier).getTime()) / (1000 * 60 * 60),
  );
}

function hasMeaningfulOverlap(left: string, right: string) {
  const leftWords = meaningfulWords(left);
  const rightWords = meaningfulWords(right);
  for (const word of leftWords) {
    if (rightWords.has(word)) return true;
  }
  return false;
}

function isGoalAligned(subject: CompletionSubject, profile: UserProfile | null) {
  if (!profile?.goals.trim()) return false;
  return hasMeaningfulOverlap(
    `${subject.title} ${subject.details} ${subject.category}`,
    profile.goals,
  );
}

function deriveSignals(
  subject: CompletionSubject,
  contexts: ContextMatch,
  history: EncouragementRecord[],
  profile: UserProfile | null,
  completedAt: string,
): EncouragementSignal[] {
  const signals = new Set<EncouragementSignal>();
  const text = normalizeText(`${subject.title} ${subject.details} ${subject.category}`);
  const ageHours = hoursBetween(subject.createdAt, completedAt);

  if (subject.priority === 'urgent' || subject.priority === 'high') signals.add('highPriority');
  if (ageHours >= 72) signals.add('delayed');
  if (ageHours >= 168) signals.add('longCarried');
  if (!history.some((record) => isSameLocalDay(record.createdAt, completedAt))) signals.add('firstToday');
  if ((history.length + 1) % 5 === 0) signals.add('milestone');
  if (history[0] && hoursBetween(history[0].createdAt, completedAt) >= 48) signals.add('returning');
  if (isGoalAligned(subject, profile)) signals.add('goalAligned');
  if (subject.sourceType === 'focus' || contexts.primary === 'focus') signals.add('focused');
  if (containsAny(text, uncertainKeywords) || contexts.primary === 'courage' || contexts.primary === 'transition') signals.add('uncertainPath');
  if (containsAny(text, restorativeKeywords) || contexts.primary === 'recovery') signals.add('restorative');
  if (containsAny(text, foundationKeywords) || ['planning', 'home', 'finance'].includes(contexts.primary)) signals.add('foundationBuilding');
  if (containsAny(text, sharedKeywords) || ['family', 'community', 'caregiving'].includes(contexts.primary)) signals.add('sharedBenefit');
  if (contexts.primary === 'creative' || contexts.secondary === 'creative') signals.add('creativeOutput');
  if (contexts.primary === 'education' || contexts.secondary === 'education') signals.add('learningProgress');
  if (signals.has('goalAligned') || contexts.primary === 'growth') signals.add('identityAligned');

  const recentRelated = history.slice(0, 40).filter(
    (record) =>
      record.context === contexts.primary ||
      hasMeaningfulOverlap(record.subjectTitle, subject.title),
  ).length;
  if (recentRelated >= 2 || containsAny(text, practiceKeywords)) signals.add('steadyPractice');

  return [...signals];
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededUnit(seed: number) {
  let value = seed + 0x6d2b79f5;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
}

function phraseList(value: string | string[]) {
  return Array.isArray(value) ? value : [value];
}

function semanticMatchCount(principle: EncouragementPrinciple, subjectText: string) {
  return (principle.keywords ?? []).reduce(
    (count, keyword) => count + (includesKeyword(subjectText, keyword) ? 1 : 0),
    0,
  );
}

function scorePrinciple(
  principle: EncouragementPrinciple,
  contexts: ContextMatch,
  signals: EncouragementSignal[],
  subjectText: string,
  history: EncouragementRecord[],
  preferences: EncouragementPreferences,
  seed: number,
) {
  let score = 0;
  if (principle.contexts.includes(contexts.primary)) score += 8;
  if (contexts.secondary && principle.contexts.includes(contexts.secondary)) score += 3.5;
  if (principle.contexts.includes('general')) score += 1;
  signals.forEach((signal) => {
    if (principle.signals.includes(signal)) score += 3.25;
  });
  score += Math.min(semanticMatchCount(principle, subjectText), 5) * 1.4;

  const savedForPrinciple = history.filter(
    (record) => record.saved && record.principleId === principle.id,
  ).length;
  const dismissedForPrinciple = history.filter(
    (record) => record.dismissed && record.principleId === principle.id,
  ).length;
  const sourceId = principle.sourceId ?? 'echiron';
  const savedForSource = history.filter(
    (record) => record.saved && record.principleSourceId === sourceId,
  ).length;
  const dismissedForSource = history.filter(
    (record) => record.dismissed && record.principleSourceId === sourceId,
  ).length;

  score += Math.min(savedForPrinciple, 4) * 2;
  score -= Math.min(dismissedForPrinciple, 4) * 2.5;
  score += Math.min(savedForSource, 6) * 0.55;
  score -= Math.min(dismissedForSource, 6) * 0.65;
  if (preferences.pinnedPrincipleIds.includes(principle.id)) score += 5;

  const recent = history.slice(0, 18);
  const recentPrincipleIndex = recent.findIndex((record) => record.principleId === principle.id);
  const recentSourceCount = recent.filter((record) => record.principleSourceId === sourceId).length;
  if (recentPrincipleIndex >= 0) {
    const repetitionPenalty = Math.max(1.5, 7 - recentPrincipleIndex * 0.45);
    const affinityFactor = preferences.pinnedPrincipleIds.includes(principle.id)
      ? 0.1
      : savedForPrinciple > 0
        ? 0.3
        : 1;
    score -= repetitionPenalty * affinityFactor;
  }
  if (!history.some((record) => record.principleId === principle.id)) score += 0.8;
  score -= Math.min(recentSourceCount, 5) * 0.35;
  score += seededUnit(seed ^ hashString(principle.id)) * 1.2;
  return score;
}

function usableName(profile: UserProfile | null, preferences: EncouragementPreferences) {
  const name = profile?.preferredName.trim();
  if (!preferences.usePreferredName || !name || profile?.isGuest || name.toLowerCase() === 'guest') return null;
  return name;
}

function chooseSignal(principle: EncouragementPrinciple, signals: EncouragementSignal[]) {
  return signals.find((signal) => principle.signals.includes(signal)) ?? signals[0] ?? null;
}

function jaccardSimilarity(left: string, right: string) {
  const leftWords = meaningfulWords(left);
  const rightWords = meaningfulWords(right);
  if (!leftWords.size || !rightWords.size) return 0;
  let intersection = 0;
  leftWords.forEach((word) => {
    if (rightWords.has(word)) intersection += 1;
  });
  return intersection / (leftWords.size + rightWords.size - intersection);
}

type Composition = {
  message: string;
  messageId: string;
};

function composeMessage(
  subject: CompletionSubject,
  principle: EncouragementPrinciple,
  contexts: ContextMatch,
  signals: EncouragementSignal[],
  profile: UserProfile | null,
  preferences: EncouragementPreferences,
  seed: number,
  attempt: number,
): Composition {
  const definition = contextById.get(contexts.primary) ?? contextById.get('general')!;
  const tonePhrases = phraseList(principle.tones[preferences.tone]);
  const selectedSignal = chooseSignal(principle, signals);
  const evidencePhrases = selectedSignal ? signalEvidence[selectedSignal] : [];
  const closings = toneClosings[preferences.tone];
  const planningStyle = profile?.planningStyle ?? 'balanced';
  const planPhrases = planningClosings[planningStyle];

  const leadIndex = (seed + attempt * 7) % definition.leads.length;
  const toneIndex = (seed + attempt * 11) % tonePhrases.length;
  const evidenceIndex = evidencePhrases.length ? (seed + attempt * 13) % evidencePhrases.length : -1;
  const practiceIndex = principle.practices?.length ? (seed + attempt * 17) % principle.practices.length : -1;
  const closeIndex = (seed + attempt * 19) % closings.length;
  const planIndex = (seed + attempt * 23) % planPhrases.length;
  const bridgeIndex = (seed + attempt * 29) % contextBridges.length;
  const nameIndex = (seed + attempt * 31) % nameOpeners.length;

  const name = usableName(profile, preferences);
  const lead = definition.leads[leadIndex];
  const opening = name ? nameOpeners[nameIndex](name, lead) : lead;
  const parts = [opening, tonePhrases[toneIndex]];

  if (evidenceIndex >= 0) parts.push(evidencePhrases[evidenceIndex]);

  if (preferences.length === 'deeper') {
    parts.push(`${contextBridges[bridgeIndex]} ${principle.summary.charAt(0).toLowerCase()}${principle.summary.slice(1)}`);
    if (practiceIndex >= 0) {
      parts.push(`A useful way to carry this forward: ${principle.practices![practiceIndex]}`);
    }
    parts.push(planPhrases[planIndex]);
  } else {
    parts.push(closings[closeIndex]);
  }

  return {
    message: parts.join(' '),
    messageId: [
      principle.id,
      contexts.primary,
      contexts.secondary ?? 'none',
      preferences.tone,
      preferences.length,
      leadIndex,
      toneIndex,
      selectedSignal ?? 'none',
      evidenceIndex,
      practiceIndex,
      preferences.length === 'deeper' ? planIndex : closeIndex,
      name ? nameIndex : -1,
    ].join(':'),
  };
}

export function generateEncouragement({
  subject,
  profile,
  history,
  preferences: rawPreferences,
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
  const preferences = normalizeEncouragementPreferences(rawPreferences);
  const contexts = classifyEncouragementContexts(subject, profile);
  const signals = deriveSignals(subject, contexts, history, profile, completedAt);
  const subjectText = normalizeText(
    `${subject.title} ${subject.details} ${subject.category} ${profile?.goals ?? ''} ${profile?.role ?? ''}`,
  );
  const allowedPrinciples = encouragementPrinciples.filter(
    (principle) => preferences.spiritualEnabled || !principle.spiritual,
  );
  const seed = hashString(
    `${subject.sourceId}:${completedAt}:${preferences.tone}:${preferences.length}:${history.length}:${excludedMessageIds.join('|')}`,
  );
  const scored = allowedPrinciples
    .map((principle) => ({
      principle,
      score: scorePrinciple(
        principle,
        contexts,
        signals,
        subjectText,
        history,
        preferences,
        seed,
      ),
    }))
    .sort((left, right) => right.score - left.score);
  const topCandidates = scored.slice(0, Math.min(40, scored.length));
  const blocked = new Set([...recentMessageIds.slice(0, 40), ...excludedMessageIds]);
  const recentMessages = history.slice(0, 24).map((record) => record.message);
  const maximumScore = topCandidates[0]?.score ?? 0;
  const relevantCandidates = topCandidates.filter(
    (candidate) => candidate.score >= maximumScore - 9,
  );
  const temperature = 3.4;
  const weightedCandidates = relevantCandidates.map((candidate) => ({
    ...candidate,
    weight: Math.exp((candidate.score - maximumScore) / temperature),
  }));
  const totalWeight = weightedCandidates.reduce(
    (total, candidate) => total + candidate.weight,
    0,
  );
  let targetWeight = seededUnit(seed ^ 0x85ebca6b) * totalWeight;
  let selectedScored = weightedCandidates[0] ?? topCandidates[0];
  for (const candidate of weightedCandidates) {
    targetWeight -= candidate.weight;
    if (targetWeight <= 0) {
      selectedScored = candidate;
      break;
    }
  }

  let bestComposition: { composition: Composition; utility: number } | undefined;
  if (selectedScored) {
    for (let attempt = 0; attempt < 72; attempt += 1) {
    const composition = composeMessage(
      subject,
      selectedScored.principle,
      contexts,
      signals,
      profile,
      preferences,
      seed,
      attempt,
    );
    const maximumSimilarity = recentMessages.reduce(
      (maximum, message) => Math.max(maximum, jaccardSimilarity(composition.message, message)),
      0,
    );
    const blockedPenalty = blocked.has(composition.messageId) ? 100 : 0;
      const utility = -maximumSimilarity * 11 - blockedPenalty;
      if (!bestComposition || utility > bestComposition.utility) {
        bestComposition = { composition, utility };
      }
    }
  }

  const selectedPrinciple = selectedScored?.principle ?? allowedPrinciples[0];
  if (!selectedPrinciple) {
    throw new Error('The encouragement library must contain at least one enabled principle.');
  }
  const composition = bestComposition?.composition ?? composeMessage(
    subject,
    selectedPrinciple,
    contexts,
    signals,
    profile,
    preferences,
    seed,
    0,
  );

  return {
    context: contexts.primary,
    secondaryContext: contexts.secondary,
    principleId: selectedPrinciple.id,
    principleTitle: selectedPrinciple.title,
    principleSource: selectedPrinciple.sourceLabel ?? 'Echiron synthesis',
    principleSourceId: selectedPrinciple.sourceId ?? 'echiron',
    matchedSignals: signals,
    messageId: composition.messageId,
    heading: subject.sourceType === 'focus' ? 'Focus block complete' : `Completed: ${subject.title}`,
    message: composition.message,
  };
}

export function getEncouragementInventory(): EncouragementInventory {
  const sources = new Set(encouragementPrinciples.map((principle) => principle.sourceId ?? 'echiron'));
  const contextLeads = contextDefinitions.reduce((count, context) => count + context.leads.length, 0);
  const principleTonePhrases = encouragementPrinciples.reduce(
    (count, principle) =>
      count +
      (Object.keys(principle.tones) as EncouragementTone[]).reduce(
        (toneCount, tone) => toneCount + phraseList(principle.tones[tone]).length,
        0,
      ),
    0,
  );
  const signalEvidencePhrases = Object.values(signalEvidence).reduce(
    (count, phrases) => count + phrases.length,
    0,
  );
  const closingPhrases = Object.values(toneClosings).reduce(
    (count, phrases) => count + phrases.length,
    0,
  ) + Object.values(planningClosings).reduce((count, phrases) => count + phrases.length, 0);
  const conservativeBaseCombinations = encouragementPrinciples.reduce(
    (total, principle) =>
      total +
      principle.contexts.reduce(
        (contextTotal, context) =>
          contextTotal +
          (contextById.get(context)?.leads.length ?? 0) *
            (Object.keys(principle.tones) as EncouragementTone[]).reduce(
              (toneTotal, tone) => toneTotal + phraseList(principle.tones[tone]).length,
              0,
            ),
        0,
      ),
    0,
  );

  return {
    principles: encouragementPrinciples.length,
    sources: sources.size,
    contexts: contextDefinitions.length,
    contextLeads,
    principleTonePhrases,
    signalEvidencePhrases,
    closingPhrases,
    conservativeBaseCombinations,
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
    case 'every': return true;
    case 'important':
      return subject.priority === 'urgent' || subject.priority === 'high' || hoursBetween(subject.createdAt, completedAt) >= 72;
    case 'firstDaily': return !history.some((record) => isSameLocalDay(record.createdAt, completedAt));
    case 'milestones': return (history.length + 1) % 5 === 0;
    case 'off': return false;
    default: return true;
  }
}

export function getLessonsEarned(history: EncouragementRecord[]): LessonSummary[] {
  const counts = new Map<string, { count: number; savedCount: number }>();
  history.forEach((record) => {
    const current = counts.get(record.principleId) ?? { count: 0, savedCount: 0 };
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
        sourceLabel: principle.sourceLabel ?? 'Echiron synthesis',
        summary: principle.summary,
        ...countData,
      };
    })
    .filter((value): value is LessonSummary => value !== null)
    .sort((left, right) => right.savedCount - left.savedCount || right.count - left.count);
}

export function getAvailablePrinciples(spiritualEnabled: boolean) {
  return encouragementPrinciples.filter(
    (principle) => spiritualEnabled || !principle.spiritual,
  );
}

export function buildWeeklyReflection(data: AppData, now = new Date()): WeeklyReflection {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - 6);
  cutoff.setHours(0, 0, 0, 0);
  const recentRecords = data.encouragementHistory.filter(
    (record) => new Date(record.createdAt) >= cutoff,
  );
  const recentTasks = data.tasks.filter(
    (task) => task.completedAt !== null && new Date(task.completedAt) >= cutoff,
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
    contextCounts.set(record.context, (contextCounts.get(record.context) ?? 0) + 1);
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
      message: 'No judgment is required here. Choose one honest next step, make it small enough to begin, and let action create the first evidence of movement.',
      completedCount,
      highPriorityCount,
      focusCount,
      dominantContextLabel,
    };
  }

  const parts = [
    `You completed ${completedCount} ${completedCount === 1 ? 'task' : 'tasks'} during the last seven days.`,
  ];
  if (highPriorityCount > 0) {
    parts.push(`${highPriorityCount} ${highPriorityCount === 1 ? 'was a high-priority commitment' : 'were high-priority commitments'}.`);
  }
  if (focusCount > 0) {
    parts.push(`You also protected ${focusCount} ${focusCount === 1 ? 'focus block' : 'focus blocks'}.`);
  }
  if (dominantContextLabel) {
    parts.push(`Your strongest pattern of movement was in ${dominantContextLabel.toLowerCase()}.`);
  }
  const returned = recentRecords.some(
    (record) => record.principleId === 'returning-beats-perfection',
  );
  parts.push(
    returned
      ? 'The important pattern was not perfection; it was your willingness to return.'
      : 'Progress did not need to be dramatic to remain real and useful.',
  );

  return {
    heading: 'Evidence from your week',
    message: parts.join(' '),
    completedCount,
    highPriorityCount,
    focusCount,
    dominantContextLabel,
  };
}
