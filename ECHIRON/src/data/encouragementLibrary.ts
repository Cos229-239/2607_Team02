import type {
  EncouragementContext,
  EncouragementTone,
} from '@/types/models';

export type EncouragementSignal =
  | 'highPriority'
  | 'delayed'
  | 'firstToday'
  | 'milestone'
  | 'returning'
  | 'goalAligned'
  | 'focused';

export type ContextDefinition = {
  id: EncouragementContext;
  label: string;
  keywords: string[];
  leads: string[];
};

export type EncouragementPrinciple = {
  id: string;
  title: string;
  summary: string;
  contexts: EncouragementContext[];
  signals: EncouragementSignal[];
  spiritual?: boolean;
  tones: Record<EncouragementTone, string>;
};

export const contextDefinitions: ContextDefinition[] = [
  {
    id: 'education',
    label: 'Learning',
    keywords: ['school', 'class', 'course', 'study', 'homework', 'assignment', 'exam', 'quiz', 'lecture', 'research', 'paper', 'degree', 'college', 'university', 'training', 'certification', 'practice', 'learn', 'reading'],
    leads: ['You turned learning into evidence.', 'You completed another piece of your development.', 'You moved knowledge from intention into practice.'],
  },
  {
    id: 'work',
    label: 'Work',
    keywords: ['work', 'job', 'client', 'meeting', 'project', 'report', 'email', 'career', 'business', 'deadline', 'proposal', 'presentation', 'application', 'interview', 'shift', 'team'],
    leads: ['You moved a responsibility from open to complete.', 'You converted professional intention into finished work.', 'You reduced the weight of an unfinished commitment.'],
  },
  {
    id: 'health',
    label: 'Health',
    keywords: ['health', 'doctor', 'medical', 'medicine', 'medication', 'appointment', 'exercise', 'workout', 'walk', 'gym', 'nutrition', 'meal', 'water', 'sleep', 'therapy', 'stretch', 'body'],
    leads: ['You kept a practical promise to your well-being.', 'You supported your body through a completed action.', 'You made care visible through follow-through.'],
  },
  {
    id: 'family',
    label: 'Relationships',
    keywords: ['family', 'parent', 'child', 'children', 'son', 'daughter', 'partner', 'spouse', 'wife', 'husband', 'friend', 'relationship', 'call', 'visit', 'conversation', 'support'],
    leads: ['You invested attention in a relationship that matters.', 'You turned care into an action someone could feel.', 'You strengthened connection through presence and follow-through.'],
  },
  {
    id: 'home',
    label: 'Home',
    keywords: ['home', 'house', 'clean', 'laundry', 'dishes', 'repair', 'maintenance', 'organize', 'room', 'kitchen', 'bathroom', 'yard', 'groceries', 'errand', 'chores'],
    leads: ['You reduced friction in the environment around you.', 'You restored order to a practical part of life.', 'You made your surroundings support you more effectively.'],
  },
  {
    id: 'creative',
    label: 'Creative work',
    keywords: ['create', 'creative', 'design', 'write', 'draw', 'paint', 'music', 'song', 'book', 'game', 'code', 'build', 'prototype', 'figma', 'art', 'video', 'edit', 'studio'],
    leads: ['You moved an idea closer to reality.', 'You gave form to something that previously existed only in possibility.', 'You completed another piece of the larger creation.'],
  },
  {
    id: 'finance',
    label: 'Finances',
    keywords: ['money', 'finance', 'financial', 'budget', 'bill', 'payment', 'bank', 'tax', 'invoice', 'save', 'debt', 'credit', 'purchase', 'accounting'],
    leads: ['You strengthened your control over a practical part of life.', 'You replaced financial uncertainty with a completed action.', 'You practiced stewardship through follow-through.'],
  },
  {
    id: 'growth',
    label: 'Personal growth',
    keywords: ['growth', 'journal', 'reflect', 'habit', 'discipline', 'mindset', 'personal', 'goal', 'confidence', 'boundary', 'courage', 'change', 'improve', 'recovery'],
    leads: ['You practiced the person you are becoming.', 'You turned an inner intention into visible evidence.', 'You strengthened growth through action rather than theory.'],
  },
  {
    id: 'focus',
    label: 'Focus',
    keywords: ['focus', 'concentrate', 'deep work', 'timer', 'block', 'distraction', 'attention', 'pomodoro', 'session'],
    leads: ['You protected your attention and used it deliberately.', 'You gave one meaningful thing your full presence.', 'You reclaimed attention from distraction.'],
  },
  {
    id: 'planning',
    label: 'Planning',
    keywords: ['plan', 'planning', 'schedule', 'calendar', 'priority', 'priorities', 'organize', 'prepare', 'list', 'outline', 'roadmap', 'strategy'],
    leads: ['You gave structure to something that could have remained scattered.', 'You made the next steps easier to see.', 'You reduced uncertainty by shaping a workable plan.'],
  },
  {
    id: 'recovery',
    label: 'Recovery',
    keywords: ['rest', 'recover', 'recovery', 'break', 'pause', 'relax', 'recharge', 'sleep', 'heal', 'healing', 'self care', 'self-care'],
    leads: ['You supported progress by making room for restoration.', 'You treated recovery as part of the work rather than its opposite.', 'You protected your capacity to continue.'],
  },
  {
    id: 'general',
    label: 'General progress',
    keywords: [],
    leads: ['You completed a real piece of your day.', 'You moved one responsibility out of the mental queue.', 'You created progress that now exists outside of intention.'],
  },
];

export const encouragementPrinciples: EncouragementPrinciple[] = [
  {
    id: 'action-creates-clarity',
    title: 'Action creates clarity',
    summary: 'You did not need perfect certainty before beginning. Completion produced information and direction that planning alone could not.',
    contexts: ['planning', 'work', 'education', 'general'],
    signals: [],
    tones: {
      gentle: 'You gave uncertainty less room by taking one clear action.',
      balanced: 'Action created clarity here; the next step is easier to see because this one is finished.',
      direct: 'You stopped negotiating with the task and completed it. That creates clarity.',
      energetic: 'That action cut through the noise. The path is clearer now.',
      reflective: 'Clarity often arrives after movement, not before it.',
    },
  },
  {
    id: 'self-trust-through-follow-through',
    title: 'Follow-through builds self-trust',
    summary: 'Each completed promise becomes evidence that your intentions can be trusted, especially when the action is ordinary and repeatable.',
    contexts: ['health', 'growth', 'work', 'general'],
    signals: ['highPriority', 'goalAligned'],
    tones: {
      gentle: 'You kept a promise to yourself, and that deserves to be recognized.',
      balanced: 'Follow-through like this builds practical self-trust.',
      direct: 'You said it mattered, then proved it through action.',
      energetic: 'That is another promise kept and another reason to trust your own word.',
      reflective: 'Self-trust grows when intention and action begin to agree.',
    },
  },
  {
    id: 'returning-beats-perfection',
    title: 'Returning beats perfection',
    summary: 'A flawless streak is not required. The ability to return after interruption is a more durable form of consistency.',
    contexts: ['growth', 'health', 'education', 'general'],
    signals: ['returning', 'delayed'],
    tones: {
      gentle: 'You returned to what mattered. That is enough to restart momentum.',
      balanced: 'The interruption did not decide the outcome; returning did.',
      direct: 'You came back and finished. That matters more than maintaining a perfect streak.',
      energetic: 'Momentum is alive again because you returned and moved.',
      reflective: 'Continuity is sometimes built through return rather than uninterrupted progress.',
    },
  },
  {
    id: 'pieces-build-the-whole',
    title: 'Finished pieces build the whole',
    summary: 'Large outcomes are rarely completed in one act. They become real through smaller pieces that are actually finished.',
    contexts: ['creative', 'education', 'work', 'home'],
    signals: ['goalAligned', 'milestone'],
    tones: {
      gentle: 'This piece matters because the larger result is built from moments like this.',
      balanced: 'Another finished piece now supports the larger goal.',
      direct: 'Big outcomes are made from completed parts. You finished one.',
      energetic: 'The larger vision just became more real.',
      reflective: 'The whole takes shape quietly through the completion of its parts.',
    },
  },
  {
    id: 'consistency-over-intensity',
    title: 'Consistency outlasts intensity',
    summary: 'Sustainable progress is created by actions that can be repeated, not by demanding maximum intensity every time.',
    contexts: ['health', 'education', 'growth', 'work'],
    signals: ['firstToday'],
    tones: {
      gentle: 'A steady step is still a meaningful step.',
      balanced: 'This completion strengthens consistency without requiring exhaustion.',
      direct: 'You did the work that can be repeated. That is how progress lasts.',
      energetic: 'Steady action wins again.',
      reflective: 'What can be repeated often carries farther than what can only be forced once.',
    },
  },
  {
    id: 'discipline-protects',
    title: 'Discipline protects what matters',
    summary: 'Healthy discipline is not punishment. It creates boundaries around the goals, people, and values that deserve protection.',
    contexts: ['focus', 'work', 'health', 'finance'],
    signals: ['highPriority', 'focused'],
    tones: {
      gentle: 'You protected something important by giving it structure and attention.',
      balanced: 'Discipline served its purpose here: it protected what mattered.',
      direct: 'You held the line and finished the priority.',
      energetic: 'You protected the mission from distraction.',
      reflective: 'Discipline becomes humane when it is used to protect rather than punish.',
    },
  },
  {
    id: 'attention-is-a-resource',
    title: 'Attention is worth protecting',
    summary: 'Focused attention is finite. Directing it intentionally is an act of stewardship, not merely a productivity technique.',
    contexts: ['focus', 'education', 'creative', 'work'],
    signals: ['focused'],
    tones: {
      gentle: 'You gave your attention a clear and useful home.',
      balanced: 'You used attention deliberately instead of letting distraction spend it for you.',
      direct: 'You controlled the focus instead of surrendering it.',
      energetic: 'You reclaimed your attention and turned it into progress.',
      reflective: 'Attention becomes meaningful when it is placed with intention.',
    },
  },
  {
    id: 'plans-can-change',
    title: 'A changed plan is not a failed mission',
    summary: 'Adjusting timing, order, or method can protect the larger purpose. Flexibility and commitment are not opposites.',
    contexts: ['planning', 'work', 'family', 'general'],
    signals: ['delayed', 'returning'],
    tones: {
      gentle: 'You found a workable path forward, even if it was not the original path.',
      balanced: 'The plan adapted, but the commitment remained.',
      direct: 'The route changed. The mission did not.',
      energetic: 'You adjusted, continued, and still got it done.',
      reflective: 'Commitment is often revealed through adaptation rather than rigidity.',
    },
  },
  {
    id: 'small-does-not-mean-meaningless',
    title: 'Small does not mean meaningless',
    summary: 'A task can be modest and still reduce friction, restore attention, or support something larger.',
    contexts: ['home', 'general', 'health', 'planning'],
    signals: [],
    tones: {
      gentle: 'This may have been small, but it still made life a little easier.',
      balanced: 'The task was modest; its effect is still real.',
      direct: 'Small work still counts when it removes real friction.',
      energetic: 'Another piece cleared. More room to move.',
      reflective: 'Meaning is not measured only by size; it is also measured by what an action supports.',
    },
  },
  {
    id: 'resistance-can-be-crossed',
    title: 'Resistance can be crossed',
    summary: 'Difficulty does not have to disappear before action becomes possible. Courage often looks like movement while resistance is still present.',
    contexts: ['growth', 'education', 'work', 'health'],
    signals: ['delayed', 'highPriority'],
    tones: {
      gentle: 'The resistance was real, and you still found a way through.',
      balanced: 'You moved through resistance instead of waiting for the task to feel easy.',
      direct: 'It was difficult. You did it anyway.',
      energetic: 'Resistance showed up, and so did you.',
      reflective: 'Courage is often the decision to continue before difficulty has disappeared.',
    },
  },
  {
    id: 'preparation-enables-action',
    title: 'Preparation is progress',
    summary: 'Preparation matters when it removes obstacles, improves judgment, and makes meaningful action more possible.',
    contexts: ['planning', 'education', 'work', 'health'],
    signals: ['goalAligned'],
    tones: {
      gentle: 'You made the next action safer and easier to begin.',
      balanced: 'This preparation created usable progress.',
      direct: 'You removed an obstacle before it could slow the real work.',
      energetic: 'The ground is ready. The next move has less resistance now.',
      reflective: 'Preparation becomes progress when it increases the possibility of wise action.',
    },
  },
  {
    id: 'environment-shapes-effort',
    title: 'Environment shapes effort',
    summary: 'Reducing physical and mental friction can make good choices easier, freeing attention for work that matters more.',
    contexts: ['home', 'planning', 'focus'],
    signals: [],
    tones: {
      gentle: 'You made the space around you more supportive.',
      balanced: 'Less friction in the environment means more capacity for what matters next.',
      direct: 'You removed a source of drag.',
      energetic: 'The path is cleaner and the next move is easier.',
      reflective: 'Order is useful when it gives attention back to the person living within it.',
    },
  },
  {
    id: 'care-becomes-visible',
    title: 'Care becomes visible through action',
    summary: 'Concern and intention gain weight when they are expressed through presence, communication, and dependable action.',
    contexts: ['family', 'health', 'home'],
    signals: ['goalAligned'],
    tones: {
      gentle: 'You gave care a practical form today.',
      balanced: 'Your concern became visible through follow-through.',
      direct: 'You did more than mean well; you acted.',
      energetic: 'Care moved from intention into the real world.',
      reflective: 'Care is often understood most clearly through what it is willing to do.',
    },
  },
  {
    id: 'responsibility-creates-freedom',
    title: 'Responsibility creates room',
    summary: 'Completing necessary responsibilities reduces hidden pressure and creates more freedom for rest, choice, and meaningful work.',
    contexts: ['finance', 'work', 'home', 'general'],
    signals: ['highPriority'],
    tones: {
      gentle: 'You lifted a real responsibility from your future self.',
      balanced: 'Completing this created more room for what comes next.',
      direct: 'You handled the responsibility instead of carrying it longer.',
      energetic: 'One less weight in the queue. More room to move.',
      reflective: 'Responsibility can create freedom when completion releases the pressure of the unfinished.',
    },
  },
  {
    id: 'rest-supports-progress',
    title: 'Recovery supports progress',
    summary: 'Rest is not automatically avoidance. Chosen recovery can preserve judgment, health, patience, and the ability to continue.',
    contexts: ['recovery', 'health', 'family'],
    signals: [],
    tones: {
      gentle: 'You made room for recovery without needing to earn your humanity first.',
      balanced: 'This recovery protected your ability to continue.',
      direct: 'Rest served the mission by preserving the person doing the work.',
      energetic: 'Capacity restored. You are protecting the long game.',
      reflective: 'Progress can include the wisdom to preserve the source from which effort comes.',
    },
  },
  {
    id: 'stewardship-builds-stability',
    title: 'Stewardship builds stability',
    summary: 'Practical attention to money, time, tools, and commitments creates a more stable foundation for future choices.',
    contexts: ['finance', 'planning', 'work'],
    signals: ['highPriority'],
    tones: {
      gentle: 'You cared for a resource that supports the rest of your life.',
      balanced: 'This act of stewardship strengthened your foundation.',
      direct: 'You handled the resource instead of leaving it unmanaged.',
      energetic: 'Foundation strengthened. Future choices just gained more support.',
      reflective: 'Stability is often built through quiet acts of responsible stewardship.',
    },
  },
  {
    id: 'creation-needs-completion',
    title: 'Creation becomes real through completion',
    summary: 'Ideas gain influence only when they are shaped into forms that can be tested, shared, used, or improved.',
    contexts: ['creative', 'work', 'education'],
    signals: ['milestone', 'goalAligned'],
    tones: {
      gentle: 'You gave the idea another real form.',
      balanced: 'Completion moved the work from imagination toward something usable.',
      direct: 'The idea is no longer only an idea. You built part of it.',
      energetic: 'The vision gained substance today.',
      reflective: 'Creation crosses into reality through the discipline of finished form.',
    },
  },
  {
    id: 'milestones-are-evidence',
    title: 'Milestones are evidence',
    summary: 'A milestone is not proof that everything is finished. It is proof that sustained action has already changed the situation.',
    contexts: ['education', 'work', 'creative', 'health', 'growth', 'general'],
    signals: ['milestone'],
    tones: {
      gentle: 'Take a moment to notice how much movement this milestone represents.',
      balanced: 'This milestone is evidence that repeated action has changed the situation.',
      direct: 'The result is measurable now. You built that evidence.',
      energetic: 'Milestone reached. The progress is no longer theoretical.',
      reflective: 'Milestones let the present recognize work that accumulated quietly over time.',
    },
  },
  {
    id: 'purpose-aligns-effort',
    title: 'Purpose gives effort direction',
    summary: 'Effort becomes more sustainable when a completed action clearly supports a goal or value the person has chosen.',
    contexts: ['growth', 'education', 'work', 'family', 'creative'],
    signals: ['goalAligned'],
    tones: {
      gentle: 'This action supported a direction you chose for yourself.',
      balanced: 'Your effort aligned with a larger goal, which gives the completion added meaning.',
      direct: 'You acted in alignment with the goal instead of merely thinking about it.',
      energetic: 'That move served the larger direction. Keep building.',
      reflective: 'Purpose does not remove effort; it helps effort know where to go.',
    },
  },
  {
    id: 'faithful-small-steps',
    title: 'Faithfulness in small steps',
    summary: 'Spiritual growth can be expressed through humble, consistent actions that honor conscience, purpose, and responsibility.',
    contexts: ['growth', 'family', 'health', 'general'],
    signals: ['goalAligned', 'firstToday'],
    spiritual: true,
    tones: {
      gentle: 'You honored what was placed in front of you through one faithful step.',
      balanced: 'Faithfulness became visible through this completed action.',
      direct: 'You answered conviction with action.',
      energetic: 'One faithful step completed. Purpose is being lived, not merely spoken.',
      reflective: 'The sacred is often carried through ordinary acts performed with faithfulness.',
    },
  },
  {
    id: 'grace-makes-return-possible',
    title: 'Grace makes return possible',
    summary: 'Grace allows a person to acknowledge interruption or failure without becoming trapped by it, then return to meaningful action.',
    contexts: ['growth', 'recovery', 'health', 'general'],
    signals: ['returning', 'delayed'],
    spiritual: true,
    tones: {
      gentle: 'You were allowed to return without condemning the path that brought you here.',
      balanced: 'Grace left room for return, and you used that room to move.',
      direct: 'The past interruption did not cancel today’s obedience.',
      energetic: 'You returned with grace and moved forward with purpose.',
      reflective: 'Grace does not erase responsibility; it makes honest return possible.',
    },
  },
  {
    id: 'service-gives-work-meaning',
    title: 'Service gives work meaning',
    summary: 'Work can carry spiritual meaning when it protects, supports, teaches, creates, or serves beyond the self.',
    contexts: ['family', 'work', 'home', 'creative'],
    signals: ['goalAligned'],
    spiritual: true,
    tones: {
      gentle: 'Your effort became a form of service through what it now supports.',
      balanced: 'This work carried meaning beyond completion because it served something larger.',
      direct: 'You turned responsibility into service.',
      energetic: 'Purpose moved through your hands and became useful.',
      reflective: 'Service can make ordinary work sacred by connecting effort to the good it supports.',
    },
  },
];

export const principleById = new Map(
  encouragementPrinciples.map((principle) => [principle.id, principle]),
);

export const contextById = new Map(
  contextDefinitions.map((context) => [context.id, context]),
);
