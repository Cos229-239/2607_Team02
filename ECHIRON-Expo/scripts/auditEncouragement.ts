import { encouragementPrinciples } from '@/data/encouragementLibrary';
import type { EncouragementPreferences } from '@/types/models';
import {
  generateEncouragement,
  getEncouragementInventory,
  type CompletionSubject,
} from '@/utils/encouragementEngine';

const preferences: EncouragementPreferences = {
  tone: 'balanced',
  frequency: 'every',
  length: 'brief',
  usePreferredName: false,
  spiritualEnabled: false,
  animationsEnabled: false,
  pinnedPrincipleIds: [],
};

const scenarios: Omit<CompletionSubject, 'sourceId' | 'createdAt'>[] = [
  { sourceType: 'task', title: 'Finish the difficult course assignment', details: 'Returned after avoiding it and completed the research.', category: 'Learning', priority: 'high' },
  { sourceType: 'task', title: 'Send the client proposal', details: 'Revised the draft and delivered it to the team.', category: 'Work', priority: 'high' },
  { sourceType: 'task', title: 'Take a recovery walk', details: 'Moved gently and protected my health after a long week.', category: 'Health', priority: 'medium' },
  { sourceType: 'task', title: 'Have a hard conversation', details: 'Set a kind boundary with my partner.', category: 'Relationships', priority: 'high' },
  { sourceType: 'task', title: 'Complete the chapter draft', details: 'Turned the closing scene into finished creative work.', category: 'Creative work', priority: 'medium' },
  { sourceType: 'task', title: 'Pay the quarterly tax bill', details: 'Reviewed the budget and submitted payment.', category: 'Finances', priority: 'urgent' },
  { sourceType: 'task', title: 'Volunteer at the food bank', details: 'Packed boxes with neighbors for local families.', category: 'Community', priority: 'medium' },
  { sourceType: 'task', title: 'Plan the upcoming move', details: 'Made a flexible schedule for an uncertain transition.', category: 'Planning', priority: 'high' },
];

const messages = new Set<string>();
const messageIds = new Set<string>();
const selectedPrinciples = new Set<string>();
const selectedSources = new Set<string>();
const contextCounts: Record<string, number> = {};

for (let index = 0; index < 1_000; index += 1) {
  const scenario = scenarios[index % scenarios.length];
  const draft = generateEncouragement({
    subject: {
      ...scenario,
      sourceId: `audit_${index}`,
      createdAt: '2026-06-01T16:00:00.000Z',
    },
    profile: null,
    history: [],
    preferences: {
      ...preferences,
      tone: ['gentle', 'balanced', 'direct', 'energetic', 'reflective'][index % 5] as EncouragementPreferences['tone'],
      length: index % 3 === 0 ? 'deeper' : 'brief',
    },
    completedAt: `2026-07-${String(1 + (index % 12)).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00.000Z`,
    recentMessageIds: [],
  });
  messages.add(draft.message);
  messageIds.add(draft.messageId);
  selectedPrinciples.add(draft.principleId);
  selectedSources.add(draft.principleSourceId);
  contextCounts[draft.context] = (contextCounts[draft.context] ?? 0) + 1;
}

const inventory = getEncouragementInventory();
const duplicatePrincipleIds = encouragementPrinciples.length - new Set(
  encouragementPrinciples.map((principle) => principle.id),
).size;

process.stdout.write(`${JSON.stringify({
  inventory,
  simulation: {
    generations: 1_000,
    uniqueMessages: messages.size,
    uniqueMessageIds: messageIds.size,
    principlesReached: selectedPrinciples.size,
    sourcesReached: selectedSources.size,
    contextCounts,
  },
  integrity: {
    duplicatePrincipleIds,
    missingSources: encouragementPrinciples.filter(
      (principle) => !principle.sourceId || !principle.sourceLabel,
    ).length,
  },
}, null, 2)}\n`);
