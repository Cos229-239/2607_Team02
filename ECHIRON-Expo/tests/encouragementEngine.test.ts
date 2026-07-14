import assert from 'node:assert/strict';
import test from 'node:test';
import { encouragementPrinciples } from '@/data/encouragementLibrary';
import type {
  EncouragementPreferences,
  EncouragementRecord,
  UserProfile,
} from '@/types/models';
import {
  classifyEncouragementContexts,
  generateEncouragement,
  getEncouragementInventory,
  type CompletionSubject,
} from '@/utils/encouragementEngine';

const preferences: EncouragementPreferences = {
  tone: 'balanced',
  frequency: 'every',
  length: 'brief',
  usePreferredName: true,
  spiritualEnabled: false,
  animationsEnabled: true,
  pinnedPrincipleIds: [],
};

const profile: UserProfile = {
  id: 'profile_test',
  name: 'Avery Morgan',
  preferredName: 'Avery',
  email: 'avery@example.test',
  role: 'Community college student and caregiver',
  timeZone: 'America/Denver',
  goals: 'Finish my nursing program, protect my health, and support my family.',
  planningStyle: 'balanced',
  notificationsEnabled: false,
  isGuest: false,
};

function subject(
  id: string,
  title = 'Study medication safety notes',
  details = 'Finish a review session for the nursing course.',
  category = 'Learning',
): CompletionSubject {
  return {
    sourceType: 'task',
    sourceId: id,
    title,
    details,
    category,
    priority: 'high',
    createdAt: '2026-07-01T16:00:00.000Z',
  };
}

function generate(
  currentSubject: CompletionSubject,
  options: {
    history?: EncouragementRecord[];
    preferences?: EncouragementPreferences;
    excludedMessageIds?: string[];
    completedAt?: string;
  } = {},
) {
  return generateEncouragement({
    subject: currentSubject,
    profile,
    history: options.history ?? [],
    preferences: options.preferences ?? preferences,
    completedAt: options.completedAt ?? '2026-07-13T16:00:00.000Z',
    recentMessageIds: [],
    excludedMessageIds: options.excludedMessageIds,
  });
}

function feedbackRecord(
  index: number,
  principleId: string,
  sourceId: string,
  saved: boolean,
): EncouragementRecord {
  return {
    id: `feedback_${index}`,
    sourceType: 'task',
    sourceId: `source_${index}`,
    subjectTitle: 'Complete a meaningful responsibility',
    subjectDetails: 'Take a practical step toward a chosen purpose.',
    subjectCategory: 'Growth',
    subjectPriority: 'high',
    subjectCreatedAt: '2026-06-01T16:00:00.000Z',
    context: 'growth',
    principleId,
    principleTitle: 'Meaning calls for a response',
    principleSource: 'Viktor Frankl',
    principleSourceId: sourceId,
    matchedSignals: ['goalAligned'],
    secondaryContext: null,
    messageId: `feedback_message_${index}`,
    heading: 'Completed',
    message: `Saved test message ${index}`,
    createdAt: `2026-06-${String(20 - index).padStart(2, '0')}T16:00:00.000Z`,
    saved,
    dismissed: !saved,
  };
}

test('the library is broad, attributable, and internally unique', () => {
  const inventory = getEncouragementInventory();
  assert.equal(inventory.principles, 134);
  assert.equal(inventory.contexts, 16);
  assert.ok(inventory.sources >= 30);
  assert.ok(inventory.contextLeads >= 128);
  assert.ok(inventory.conservativeBaseCombinations > 25_000);
  assert.equal(
    new Set(encouragementPrinciples.map((principle) => principle.id)).size,
    encouragementPrinciples.length,
  );
  encouragementPrinciples.forEach((principle) => {
    assert.ok(principle.sourceId);
    assert.ok(principle.sourceLabel);
    assert.ok(principle.summary.length >= 40);
    assert.deepEqual(Object.keys(principle.tones).sort(), [
      'balanced', 'direct', 'energetic', 'gentle', 'reflective',
    ]);
  });
});

test('representative completions receive primary and secondary context', () => {
  assert.equal(
    classifyEncouragementContexts(
      subject('finance', 'Pay quarterly tax bill', 'Review the budget and submit payment.', 'Finances'),
      profile,
    ).primary,
    'finance',
  );
  const relationship = classifyEncouragementContexts(
    subject('courage', 'Have the hard conversation', 'Set a kind boundary with my partner.', 'Relationships'),
    profile,
  );
  assert.equal(relationship.primary, 'family');
  assert.equal(relationship.secondary, 'courage');
  assert.equal(
    classifyEncouragementContexts(
      { ...subject('focus'), sourceType: 'focus', category: 'Creative work' },
      profile,
    ).primary,
    'focus',
  );
});

test('generation is deterministic while Another excludes the current composition', () => {
  const first = generate(subject('same-seed'));
  const repeat = generate(subject('same-seed'));
  assert.deepEqual(repeat, first);
  const another = generate(subject('same-seed'), {
    excludedMessageIds: [first.messageId],
  });
  assert.notEqual(another.messageId, first.messageId);
  assert.notEqual(another.message, first.message);
  assert.match(first.message, /Avery/);
});

test('opt-in spiritual material stays out when the preference is off', () => {
  for (let index = 0; index < 150; index += 1) {
    const draft = generate(subject(`nonspiritual_${index}`), {
      completedAt: `2026-07-13T${String(index % 24).padStart(2, '0')}:00:00.000Z`,
    });
    const principle = encouragementPrinciples.find((item) => item.id === draft.principleId);
    assert.equal(principle?.spiritual, undefined);
  }
});

test('varied life contexts produce substantial output and principle variety', () => {
  const samples = [
    ['Submit client proposal', 'Finished the revised pricing and sent it to the team.', 'Work'],
    ['Take a recovery walk', 'Moved gently outside after a difficult week.', 'Health'],
    ['Call my father', 'Checked in and listened without rushing.', 'Relationships'],
    ['Finish chapter draft', 'Wrote and revised the closing scene.', 'Creative work'],
    ['Organize the kitchen', 'Cleared the counters and prepared meals.', 'Home'],
    ['Ask for help', 'Spoke honestly about an uncertain transition.', 'Courageous action'],
    ['Volunteer at the food bank', 'Packed boxes with neighbors.', 'Community'],
    ['Plan next semester', 'Mapped classes and important deadlines.', 'Planning'],
  ];
  const messageIds = new Set<string>();
  const principles = new Set<string>();
  for (let index = 0; index < 240; index += 1) {
    const sample = samples[index % samples.length];
    const draft = generate(
      subject(`variety_${index}`, sample[0], sample[1], sample[2]),
      { completedAt: `2026-07-${String(1 + (index % 12)).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00.000Z` },
    );
    messageIds.add(draft.messageId);
    principles.add(draft.principleId);
  }
  assert.ok(messageIds.size >= 150, `expected at least 150 compositions, received ${messageIds.size}`);
  assert.ok(principles.size >= 45, `expected at least 45 principles, received ${principles.size}`);
});

test('saved feedback increases affinity without making one source compulsory', () => {
  const franklPrinciples = [
    'frankl-meaning-calls-for-response',
    'frankl-chosen-attitude',
    'frankl-purpose-beyond-self',
    'frankl-life-answered-by-action',
  ];
  const savedHistory = Array.from({ length: 12 }, (_, index) =>
    feedbackRecord(index, franklPrinciples[index % franklPrinciples.length], 'frankl', true),
  );
  let baselineFrankl = 0;
  let learnedFrankl = 0;
  const learnedPrinciples = new Set<string>();
  for (let index = 0; index < 80; index += 1) {
    const current = subject(
      `meaning_${index}`,
      'Complete a meaningful responsibility',
      'Take a practical step toward a chosen purpose and support my family.',
      'Personal growth',
    );
    const completedAt = `2026-07-${String(1 + (index % 12)).padStart(2, '0')}T${String(index % 24).padStart(2, '0')}:00:00.000Z`;
    if (generate(current, { completedAt }).principleSourceId === 'frankl') baselineFrankl += 1;
    const learned = generate(current, { history: savedHistory, completedAt });
    if (learned.principleSourceId === 'frankl') learnedFrankl += 1;
    learnedPrinciples.add(learned.principleId);
  }
  assert.ok(
    learnedFrankl > baselineFrankl,
    `expected saved-source affinity to increase Frankl selections (${baselineFrankl} → ${learnedFrankl})`,
  );
  assert.ok(learnedPrinciples.size > 1);
});

test('generated copy avoids shame, diagnosis, coercion, and magical guarantees', () => {
  const banned = /you(?:'re| are) (?:lazy|broken|a failure)|should be ashamed|guarantee(?:d)? success|cure your|diagnos(?:e|is)|no excuses|everyone else/i;
  for (const tone of ['gentle', 'balanced', 'direct', 'energetic', 'reflective'] as const) {
    for (const length of ['brief', 'deeper'] as const) {
      for (let index = 0; index < 40; index += 1) {
        const draft = generate(subject(`safe_${tone}_${length}_${index}`), {
          preferences: { ...preferences, tone, length },
          completedAt: `2026-07-${String(1 + (index % 12)).padStart(2, '0')}T16:00:00.000Z`,
        });
        assert.doesNotMatch(draft.message, banned);
      }
    }
  }
});
