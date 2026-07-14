import type {
  EncouragementContext,
  EncouragementTone,
} from '@/types/models';
import { philosophicalPrinciples } from '@/data/philosophicalPrinciples';
import { behavioralPrinciples } from '@/data/behavioralPrinciples';
import { humanisticPrinciples } from '@/data/humanisticPrinciples';

export type EncouragementSignal =
  | 'highPriority'
  | 'delayed'
  | 'firstToday'
  | 'milestone'
  | 'returning'
  | 'goalAligned'
  | 'focused'
  | 'longCarried'
  | 'steadyPractice'
  | 'sharedBenefit'
  | 'foundationBuilding'
  | 'restorative'
  | 'creativeOutput'
  | 'learningProgress'
  | 'uncertainPath'
  | 'identityAligned';

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
  keywords?: string[];
  practices?: string[];
  sourceId?: string;
  sourceLabel?: string;
  sourceNote?: string;
  spiritual?: boolean;
  tones: Record<EncouragementTone, string | string[]>;
};

const baseContextDefinitions: ContextDefinition[] = [
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
    id: 'community',
    label: 'Community',
    keywords: ['community', 'neighbor', 'neighbour', 'volunteer', 'mutual aid', 'civic', 'local group', 'club', 'association', 'organize', 'organise', 'donate', 'outreach'],
    leads: ['You contributed to a world larger than your own task list.', 'You turned belonging into participation.', 'You strengthened a shared space through completed action.'],
  },
  {
    id: 'caregiving',
    label: 'Caregiving',
    keywords: ['caregiving', 'caregiver', 'care for', 'appointment ride', 'pick up medication', 'check in', 'dependent', 'elder care', 'child care', 'pet care', 'support person'],
    leads: ['You carried care into a concrete act of support.', 'You completed work that protected another person’s well-being.', 'You made dependability visible through care.'],
  },
  {
    id: 'transition',
    label: 'Life transition',
    keywords: ['move', 'moving', 'new job', 'new role', 'transition', 'change', 'relocate', 'graduation', 'retire', 'retirement', 'begin again', 'fresh start', 'application'],
    leads: ['You gave an uncertain transition one completed point of structure.', 'You moved from an old condition toward a new one.', 'You made change more navigable through one finished action.'],
  },
  {
    id: 'courage',
    label: 'Courageous action',
    keywords: ['difficult', 'avoided', 'hard conversation', 'apologize', 'apologise', 'boundary', 'ask for help', 'speak up', 'confront', 'fear', 'courage', 'finally'],
    leads: ['You completed something that required more than convenience.', 'You gave courage a concrete form.', 'You moved toward what mattered even though avoidance was available.'],
  },
  {
    id: 'general',
    label: 'General progress',
    keywords: [],
    leads: ['You completed a real piece of your day.', 'You moved one responsibility out of the mental queue.', 'You created progress that now exists outside of intention.'],
  },
];

const expandedContextLeads: Record<EncouragementContext, string[]> = {
  education: ['You gave curiosity somewhere concrete to go.', 'You added another finished layer to what you know.', 'You made study count through follow-through.', 'You practiced a capacity that can now grow stronger.', 'You carried learning across the line from exposure to use.'],
  work: ['You gave your effort a finished professional result.', 'You closed a loop that had been asking for attention.', 'You made reliability visible in the work itself.', 'You created more room by finishing what was open.', 'You advanced the work through a result someone can now use.'],
  health: ['You chose an action that supports continued capacity.', 'You treated well-being as something worthy of practical attention.', 'You answered a physical need with follow-through.', 'You invested in the person who must carry every other goal.', 'You made health support tangible rather than abstract.'],
  family: ['You made connection more dependable through action.', 'You gave time or attention to a bond that helps hold life together.', 'You showed that care can be completed, not merely intended.', 'You strengthened trust through presence.', 'You supported a relationship through something real and finished.'],
  home: ['You made daily life easier to inhabit.', 'You removed a source of ordinary friction.', 'You gave future effort a more supportive environment.', 'You completed maintenance that quietly protects everything around it.', 'You reclaimed usefulness, order, or ease in your space.'],
  creative: ['You carried imagination into form.', 'You made the unseen a little more shareable.', 'You gave the larger vision another finished component.', 'You turned possibility into material that can be tested or refined.', 'You brought a fragment of the work out of your mind and into the world.'],
  finance: ['You gave future choice a more stable foundation.', 'You faced a practical reality and reduced its uncertainty.', 'You turned financial attention into stewardship.', 'You completed an action that protects tomorrow from avoidable pressure.', 'You strengthened your relationship with a resource that affects many choices.'],
  growth: ['You acted in the direction of the person you intend to become.', 'You made an inner commitment visible.', 'You practiced change instead of waiting to feel transformed first.', 'You gave self-knowledge a behavioral expression.', 'You completed a step that can become part of your character.'],
  focus: ['You directed attention instead of scattering it.', 'You created a protected interval for meaningful work.', 'You turned concentration into finished evidence.', 'You gave your mind one clear place to stand.', 'You practiced choosing where your finite attention would go.'],
  planning: ['You converted complexity into a usable next structure.', 'You made uncertainty smaller by naming an order.', 'You gave future action a clearer entrance.', 'You turned scattered demands into something navigable.', 'You prepared a path that requires less guesswork from your future self.'],
  recovery: ['You respected the limits that make continued effort possible.', 'You restored capacity instead of treating depletion as a virtue.', 'You completed an act of renewal.', 'You made space for the system carrying all the work to recover.', 'You protected endurance by allowing restoration to count.'],
  community: ['You added strength to a shared human structure.', 'You participated in the kind of community you want to exist.', 'You placed effort where other people can benefit from it.', 'You made contribution visible through action.', 'You completed something whose value extends beyond one person.'],
  caregiving: ['You translated concern into dependable support.', 'You protected another person through follow-through.', 'You gave care time, structure, and completion.', 'You carried a responsibility that helps another life remain steadier.', 'You made compassion practical.'],
  transition: ['You placed one stable stone in changing ground.', 'You gave the next chapter a concrete beginning.', 'You reduced the shapelessness of change through action.', 'You completed a bridge between what was and what is becoming.', 'You met transition with movement instead of demanding total certainty.'],
  courage: ['You faced a task that could have remained avoided.', 'You made a difficult truth easier to live with through action.', 'You chose movement where retreat would have been simpler.', 'You completed an act that required honesty or nerve.', 'You crossed a threshold that hesitation had been guarding.'],
  general: ['You gave the day one more finished fact.', 'You transformed an open loop into evidence of agency.', 'You made forward movement concrete.', 'You completed something your future self no longer has to carry.', 'You created a result that did not exist before your action.'],
};

export const contextDefinitions: ContextDefinition[] = baseContextDefinitions.map(
  (definition) => ({
    ...definition,
    leads: [...definition.leads, ...expandedContextLeads[definition.id]],
  }),
);

const foundationalPrinciples: EncouragementPrinciple[] = [
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

const foundationalSourceByPrinciple: Record<string, string> = {
  'action-creates-clarity': 'first-principles',
  'self-trust-through-follow-through': 'self-determination',
  'returning-beats-perfection': 'resilience',
  'pieces-build-the-whole': 'first-principles',
  'consistency-over-intensity': 'positive-psychology',
  'discipline-protects': 'trauma-informed',
  'attention-is-a-resource': 'acceptance-commitment',
  'plans-can-change': 'resilience',
  'small-does-not-mean-meaningless': 'positive-psychology',
  'resistance-can-be-crossed': 'acceptance-commitment',
  'preparation-enables-action': 'first-principles',
  'environment-shapes-effort': 'behavior-design',
  'care-becomes-visible': 'self-determination',
  'responsibility-creates-freedom': 'first-principles',
  'rest-supports-progress': 'self-compassion',
  'stewardship-builds-stability': 'first-principles',
  'creation-needs-completion': 'first-principles',
  'milestones-are-evidence': 'positive-psychology',
  'purpose-aligns-effort': 'acceptance-commitment',
  'faithful-small-steps': 'spiritual-wisdom',
  'grace-makes-return-possible': 'spiritual-wisdom',
  'service-gives-work-meaning': 'spiritual-wisdom',
};

export const principleSourceLabels: Record<string, string> = {
  echiron: 'Echiron synthesis',
  'first-principles': 'First-principles reasoning',
  'self-determination': 'Self-Determination Theory',
  'motivational-interviewing': 'Motivational Interviewing',
  'cognitive-behavioral': 'Cognitive-behavioral psychology',
  'acceptance-commitment': 'Acceptance and Commitment principles',
  'self-compassion': 'Self-compassion psychology',
  'trauma-informed': 'Trauma-informed practice',
  'positive-psychology': 'Positive psychology and resilience',
  resilience: 'Resilience research',
  'behavior-design': 'Behavior design',
  'spiritual-wisdom': 'Opt-in spiritual wisdom',
  jung: 'Carl Jung',
  watts: 'Alan Watts',
  laozi: 'Laozi',
  zhuangzi: 'Zhuangzi',
  epictetus: 'Epictetus',
  frankl: 'Viktor Frankl',
  james: 'William James',
  campbell: 'Joseph Campbell',
};

const enrichedFoundationalPrinciples = foundationalPrinciples.map(
  (principle): EncouragementPrinciple => {
    const sourceId =
      principle.sourceId ??
      foundationalSourceByPrinciple[principle.id] ??
      'echiron';

    return {
      ...principle,
      sourceId,
      sourceLabel: principle.sourceLabel ?? principleSourceLabels[sourceId],
      sourceNote:
        principle.sourceNote ??
        'An operational principle distilled for supportive, agency-preserving encouragement.',
      keywords:
        principle.keywords ??
        `${principle.title} ${principle.summary}`
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length >= 5),
      practices: principle.practices ?? [],
    };
  },
);

export const encouragementPrinciples: EncouragementPrinciple[] = [
  ...enrichedFoundationalPrinciples,
  ...philosophicalPrinciples,
  ...behavioralPrinciples,
  ...humanisticPrinciples,
];

export const principleById = new Map(
  encouragementPrinciples.map((principle) => [principle.id, principle]),
);

export const contextById = new Map(
  contextDefinitions.map((context) => [context.id, context]),
);
