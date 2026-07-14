import type {
  EncouragementPrinciple,
} from '@/data/encouragementLibrary';
import type {
  EncouragementContext,
  EncouragementTone,
} from '@/types/models';

type PrincipleSeed = Omit<
  EncouragementPrinciple,
  'sourceId' | 'sourceLabel' | 'sourceNote'
>;

function tones(
  gentle: string,
  balanced: string,
  direct: string,
  energetic: string,
  reflective: string,
): Record<EncouragementTone, string> {
  return { gentle, balanced, direct, energetic, reflective };
}

function lens(
  sourceId: string,
  sourceLabel: string,
  sourceNote: string,
  principles: PrincipleSeed[],
): EncouragementPrinciple[] {
  return principles.map((principle) => ({
    ...principle,
    sourceId,
    sourceLabel,
    sourceNote,
  }));
}

const broadContexts: EncouragementContext[] = [
  'education',
  'work',
  'health',
  'family',
  'home',
  'creative',
  'finance',
  'growth',
  'focus',
  'planning',
  'recovery',
  'community',
  'caregiving',
  'transition',
  'courage',
  'general',
];

export const philosophicalPrinciples: EncouragementPrinciple[] = [
  ...lens(
    'jung',
    'Carl Jung',
    'A practical adaptation of Jungian individuation, shadow integration, projection, compensation, and the tension of opposites. It is not diagnosis or psychotherapy.',
    [
      {
        id: 'jung-individuation-through-action',
        title: 'Becoming requires lived choices',
        summary:
          'Individuation is not a slogan about being unique. It is the long work of bringing values, neglected capacities, and conscious choices into a more integrated life.',
        contexts: ['growth', 'creative', 'transition', 'courage', 'general'],
        signals: ['goalAligned', 'identityAligned'],
        keywords: ['identity', 'become', 'authentic', 'values', 'growth', 'change'],
        practices: [
          'Notice which part of you this action allowed to become more real.',
          'Let the next choice continue the alignment between what you value and what you practice.',
        ],
        tones: tones(
          'You gave the person you are becoming one gentle piece of evidence.',
          'This action brought intention and lived identity into closer agreement.',
          'You became more congruent by doing what your stated direction required.',
          'That was not just progress on a task; it was practice in becoming.',
          'A self is shaped through the choices it repeatedly brings into life.',
        ),
      },
      {
        id: 'jung-shadow-into-awareness',
        title: 'What is faced can become usable',
        summary:
          'The shadow names qualities, needs, fears, and capacities that have been pushed outside the preferred self-image. Honest recognition can release energy that avoidance keeps bound.',
        contexts: ['growth', 'courage', 'family', 'transition', 'general'],
        signals: ['delayed', 'longCarried', 'returning'],
        keywords: ['avoided', 'difficult', 'finally', 'truth', 'boundary', 'apology', 'fear'],
        practices: [
          'Ask what this avoided task was protecting you from and what capacity finishing it returned to you.',
          'Name the resistance without shaming it, then keep the useful strength that appeared when you acted.',
        ],
        tones: tones(
          'You met something you had not been ready to face before, and you met it without needing to attack yourself.',
          'Bringing this into action reduced the power of what remained avoided.',
          'You faced what was easier to leave in the dark and made it workable.',
          'Avoidance lost ground because you brought the task into the light and finished it.',
          'Awareness becomes integration when a disowned difficulty is met consciously and carried into action.',
        ),
      },
      {
        id: 'jung-hold-the-opposites',
        title: 'Opposites can create a wiser third path',
        summary:
          'Conflicting needs do not always require one side to be destroyed. Holding the tension long enough can reveal a response that honors more of the whole situation.',
        contexts: ['planning', 'family', 'work', 'transition', 'recovery'],
        signals: ['uncertainPath', 'goalAligned', 'restorative'],
        keywords: ['balance', 'conflict', 'choice', 'both', 'decision', 'tradeoff', 'compromise'],
        practices: [
          'Name the two legitimate needs this completion helped reconcile.',
          'Before forcing the next choice, look for an option that preserves the value carried by both sides.',
        ],
        tones: tones(
          'You made room for more than one real need and still found a step forward.',
          'This completion suggests that firmness and flexibility did not have to cancel each other.',
          'You refused a false either-or and built a workable response.',
          'Two competing truths produced movement instead of paralysis.',
          'Wholeness often emerges by sustaining a tension until a more adequate response becomes visible.',
        ),
      },
      {
        id: 'jung-reclaim-projection',
        title: 'Reclaimed judgment becomes self-knowledge',
        summary:
          'Projection places an unrecognized expectation or quality entirely outside the self. Reclaiming one responsible part of the picture restores choice without excusing harm from others.',
        contexts: ['family', 'community', 'caregiving', 'courage', 'growth'],
        signals: ['sharedBenefit', 'identityAligned'],
        keywords: ['conversation', 'apology', 'conflict', 'relationship', 'boundary', 'feedback'],
        practices: [
          'Separate what belongs to the other person from the response, expectation, or boundary that belongs to you.',
          'Keep accountability specific: own your part without claiming responsibility for everything.',
        ],
        tones: tones(
          'You took responsibility for a part you could influence without making yourself responsible for the whole situation.',
          'This action moved the relationship from assumption toward clearer ownership.',
          'You reclaimed your agency by handling your part directly.',
          'Less projection, more ownership, and a clearer place from which to act.',
          'Self-knowledge deepens when judgment is examined for the part of it that points back toward our own work.',
        ),
      },
    ],
  ),
  ...lens(
    'watts',
    'Alan Watts',
    'A practical adaptation of Watts on process, present experience, polarity, interdependence, play, and Taoist non-forcing. It does not imitate his voice or reproduce his wording.',
    [
      {
        id: 'watts-life-is-process',
        title: 'Progress is a living process, not a final arrival',
        summary:
          'A life cannot be reduced to reaching a permanent state of completion. Goals matter, but their value includes the quality of attention and participation practiced along the way.',
        contexts: broadContexts,
        signals: ['steadyPractice', 'firstToday'],
        keywords: ['process', 'practice', 'daily', 'routine', 'continue', 'progress'],
        practices: [
          'Notice the quality of participation that made this step worth living, not only the fact that it ended.',
          'Let the next action be another movement in the process rather than a demand to arrive forever.',
        ],
        tones: tones(
          'You are allowed to value this step without asking it to complete your whole life.',
          'This mattered as part of the process, not only as a box that is now closed.',
          'Finish the step, release the fantasy of permanent arrival, and keep living the work.',
          'One movement completed; the larger dance has more room now.',
          'The meaning of a path is carried in how it is walked, not only in where its final marker stands.',
        ),
      },
      {
        id: 'watts-non-forcing',
        title: 'Effective action does not always require force',
        summary:
          'Non-forcing is not passivity. It is the skill of working with timing, structure, energy, and reality so that effort is not wasted fighting conditions that can be understood or redirected.',
        contexts: ['planning', 'work', 'health', 'creative', 'recovery', 'transition'],
        signals: ['uncertainPath', 'restorative', 'foundationBuilding'],
        keywords: ['adjust', 'simplify', 'flow', 'timing', 'easier', 'adapt', 'rest'],
        practices: [
          'Identify what became easier when you stopped using force as the only strategy.',
          'For the next step, change the conditions before demanding more intensity from yourself.',
        ],
        tones: tones(
          'You found a way through that did not require violence toward your own limits.',
          'This completion used fit and timing, not force alone.',
          'You worked with the real conditions and got the result.',
          'Less wasted struggle, more effective movement.',
          'Wisdom sometimes appears as the discovery that strain and sincerity are not the same thing.',
        ),
      },
      {
        id: 'watts-mutual-arising',
        title: 'Nothing meaningful is accomplished alone',
        summary:
          'Person and environment, effort and support, giver and receiver arise in relationship. Recognizing interdependence can preserve gratitude without erasing individual agency.',
        contexts: ['family', 'community', 'caregiving', 'work', 'home'],
        signals: ['sharedBenefit', 'steadyPractice'],
        keywords: ['team', 'together', 'support', 'community', 'family', 'help', 'care'],
        practices: [
          'Recognize both the effort you contributed and the conditions or people that made it possible.',
          'Consider who can now move more easily because this action was completed.',
        ],
        tones: tones(
          'Your effort mattered, and it was held within a larger web of support and consequence.',
          'This completion shows agency and interdependence working together.',
          'You did your part inside a system where every useful part affects another.',
          'Your move strengthened more than one point in the web.',
          'The boundary between personal progress and shared life is often more porous than it first appears.',
        ),
      },
      {
        id: 'watts-polarity-belongs',
        title: 'A full life contains complementary opposites',
        summary:
          'Effort and rest, structure and freedom, seriousness and play define and support one another. Treating one pole as the enemy can make the whole system less intelligent.',
        contexts: ['recovery', 'planning', 'creative', 'health', 'growth'],
        signals: ['restorative', 'steadyPractice', 'uncertainPath'],
        keywords: ['balance', 'rest', 'work', 'play', 'structure', 'flexible', 'rhythm'],
        practices: [
          'Name the complementary pole that this action makes possible: rest after effort, freedom through structure, or play within discipline.',
          'Build the next rhythm with both poles present instead of glorifying only one.',
        ],
        tones: tones(
          'You honored one side of a rhythm that needs both movement and pause.',
          'This step worked because apparent opposites can support the same life.',
          'Stop treating one necessary half of the rhythm as failure.',
          'Structure and freedom just worked on the same team.',
          'Opposites are not always enemies; often each gives the other its meaning.',
        ),
      },
    ],
  ),
  ...lens(
    'laozi',
    'Laozi',
    'A practical adaptation of Dao De Jing themes: non-coercive action, simplicity, yielding strength, enoughness, and alignment with conditions.',
    [
      {
        id: 'laozi-watercourse-adaptation',
        title: 'Adaptation can carry strength farther than force',
        summary:
          'Water does not surrender its direction when it moves around an obstacle. Flexible movement can preserve purpose while reducing needless collision.',
        contexts: ['planning', 'work', 'health', 'transition', 'courage'],
        signals: ['uncertainPath', 'returning', 'delayed'],
        keywords: ['adapt', 'change plan', 'route', 'obstacle', 'flexible', 'workaround'],
        practices: [
          'Preserve the purpose and loosen the route.',
          'Ask what the obstacle is teaching you about the shape of the next workable move.',
        ],
        tones: tones(
          'You found a gentler route without abandoning what mattered.',
          'Adaptation protected the direction of the work.',
          'The obstacle changed the route, not the purpose.',
          'You moved around resistance and kept the current alive.',
          'A path can remain faithful to its destination while changing shape around the ground it meets.',
        ),
      },
      {
        id: 'laozi-simplicity-restores-power',
        title: 'Simplicity returns energy to what matters',
        summary:
          'Complexity can consume the attention needed for action. Removing excess restores contact with the essential movement the situation actually requires.',
        contexts: ['planning', 'home', 'finance', 'focus', 'general'],
        signals: ['foundationBuilding', 'uncertainPath'],
        keywords: ['simplify', 'declutter', 'organize', 'priority', 'essential', 'reduce'],
        practices: [
          'Keep the part that carries the purpose and release one layer that only carries noise.',
          'State the next necessary action in one plain sentence.',
        ],
        tones: tones(
          'You made the path kinder by removing what it did not need.',
          'Simplicity restored attention to the essential task.',
          'You cut away noise and completed what mattered.',
          'Less clutter, more power, clearer movement.',
          'What remains after excess is removed often reveals the work that was quietly waiting underneath.',
        ),
      },
      {
        id: 'laozi-yielding-strength',
        title: 'Yielding can protect what rigidity would break',
        summary:
          'Softness is not the absence of strength. The ability to bend, pause, listen, or revise can preserve the person and the mission through pressure.',
        contexts: ['family', 'caregiving', 'health', 'recovery', 'transition'],
        signals: ['restorative', 'sharedBenefit', 'uncertainPath'],
        keywords: ['listen', 'pause', 'revise', 'recover', 'gentle', 'flexible'],
        practices: [
          'Identify where flexibility preserved something more important than winning the original form.',
          'Carry firmness in the value and softness in the method.',
        ],
        tones: tones(
          'You made room without disappearing, and that is a real form of strength.',
          'Flexibility preserved what rigid force might have damaged.',
          'You bent where needed without surrendering the core.',
          'Soft method, strong purpose, completed movement.',
          'The strength that can yield is often the strength that remains available after pressure passes.',
        ),
      },
      {
        id: 'laozi-enough-to-begin',
        title: 'Enough is a powerful place to begin',
        summary:
          'Grasping for perfect readiness can multiply delay. Beginning with what is present allows capability, information, and momentum to grow through use.',
        contexts: ['general', 'education', 'creative', 'planning', 'courage'],
        signals: ['firstToday', 'uncertainPath', 'creativeOutput'],
        keywords: ['start', 'begin', 'draft', 'enough', 'small', 'first step'],
        practices: [
          'Treat the resources that were sufficient for this step as a legitimate beginning.',
          'Let the next version improve through contact with reality rather than waiting for flawless readiness.',
        ],
        tones: tones(
          'What you had was enough for this honest step.',
          'You began from the real conditions instead of waiting for imaginary completeness.',
          'You used what was available and moved.',
          'Enough became action, and action created more possibility.',
          'A beginning does not need to contain the whole journey; it only needs enough reality to take form.',
        ),
      },
    ],
  ),
  ...lens(
    'zhuangzi',
    'Zhuangzi',
    'A practical adaptation of Zhuangzi on changing perspective, spontaneous transformation, the usefulness of open space, and skill that develops beyond strain.',
    [
      {
        id: 'zhuangzi-perspective-loosens-the-knot',
        title: 'A changed perspective can reveal a new freedom',
        summary:
          'Rigid distinctions can make one interpretation appear absolute. Shifting scale, standpoint, or time horizon can expose options that the first frame concealed.',
        contexts: ['growth', 'family', 'work', 'transition', 'courage'],
        signals: ['uncertainPath', 'delayed'],
        keywords: ['perspective', 'reframe', 'stuck', 'decision', 'conflict', 'view'],
        practices: [
          'Describe the task from the viewpoint of your future self, another affected person, or a longer time horizon.',
          'Ask which part of the problem exists because of the frame rather than the facts.',
        ],
        tones: tones(
          'You gave the situation another angle and found more room to move.',
          'A wider perspective helped turn a fixed problem into a workable action.',
          'You changed the frame and broke the stalemate.',
          'New angle, new opening, real movement.',
          'What seems immovable from one standpoint may become fluid when the standpoint itself is allowed to change.',
        ),
      },
      {
        id: 'zhuangzi-transformation-is-natural',
        title: 'Change is not a betrayal of what came before',
        summary:
          'Life continually changes form. Development can honor a prior stage without requiring the person, plan, or identity to remain frozen inside it.',
        contexts: ['transition', 'growth', 'creative', 'health', 'general'],
        signals: ['identityAligned', 'returning', 'goalAligned'],
        keywords: ['change', 'transition', 'new', 'release', 'become', 'transform'],
        practices: [
          'Name what this new form preserves and what it no longer needs to carry.',
          'Let completed evidence update the story you tell about who you are able to become.',
        ],
        tones: tones(
          'You allowed change to become part of your continuity rather than proof that the past was wrong.',
          'This action gave transformation a stable, practical form.',
          'You stopped asking the old version of the plan to govern the new reality.',
          'The next form is arriving through what you just completed.',
          'Continuity is not always sameness; sometimes it is the thread that survives through genuine transformation.',
        ),
      },
      {
        id: 'zhuangzi-useful-open-space',
        title: 'Open space has practical value',
        summary:
          'Not every useful condition is filled with visible production. Margin, silence, rest, and uncommitted capacity allow responsiveness and creative movement.',
        contexts: ['recovery', 'planning', 'creative', 'focus', 'health'],
        signals: ['restorative', 'foundationBuilding'],
        keywords: ['space', 'margin', 'rest', 'clear', 'pause', 'buffer', 'break'],
        practices: [
          'Protect one piece of the space this action created instead of immediately filling all of it.',
          'Notice what becomes possible because there is now room to respond.',
        ],
        tones: tones(
          'You created room, and room itself can be a form of care.',
          'This completion made useful space available.',
          'Do not erase the benefit by filling every opening at once.',
          'Space reclaimed; possibility has somewhere to enter.',
          'An opening may look empty while quietly performing the essential work of making movement possible.',
        ),
      },
      {
        id: 'zhuangzi-skill-beyond-strain',
        title: 'Practice can turn force into fluency',
        summary:
          'Deep skill develops through attentive repetition until action fits the structure of the work. Mastery often feels less like domination and more like intelligent responsiveness.',
        contexts: ['education', 'creative', 'work', 'focus', 'home'],
        signals: ['steadyPractice', 'learningProgress', 'creativeOutput'],
        keywords: ['practice', 'skill', 'craft', 'repeat', 'learn', 'mastery', 'technique'],
        practices: [
          'Identify the part that required less conscious force because practice has begun to organize it.',
          'Repeat the useful pattern while it is still clear enough to become easier next time.',
        ],
        tones: tones(
          'Your practice is helping the work fit your hands more naturally.',
          'Repetition is converting effort into fluency.',
          'You are learning the structure well enough to stop fighting every movement.',
          'Skill is taking root; the work moved with you this time.',
          'Mastery often appears when attentive practice allows action to follow the grain of the thing itself.',
        ),
      },
    ],
  ),
  ...lens(
    'epictetus',
    'Epictetus',
    'A practical adaptation of the Enchiridion and Discourses on agency, impressions, responsibility, roles, and releasing outcomes outside personal control.',
    [
      {
        id: 'epictetus-act-within-control',
        title: 'Agency begins with what is actually yours to do',
        summary:
          'Attention becomes effective when it is directed toward choices, judgments, and actions that belong to the person rather than outcomes controlled by other people or chance.',
        contexts: broadContexts,
        signals: ['highPriority', 'uncertainPath', 'goalAligned'],
        keywords: ['control', 'choice', 'action', 'response', 'decision', 'responsibility'],
        practices: [
          'Separate the next controllable action from the outcome you can influence but cannot command.',
          'Measure success first by the quality of your choice and execution.',
        ],
        tones: tones(
          'You gave your energy to the part that truly belonged to you.',
          'This completion is evidence of agency applied where agency was available.',
          'You handled your action; the rest does not need to be controlled to make that real.',
          'Your part was yours, and you moved it.',
          'Freedom grows when effort is invested in the domain of choice rather than chained to every external result.',
        ),
      },
      {
        id: 'epictetus-release-unowned-outcomes',
        title: 'A worthy action does not require a guaranteed outcome',
        summary:
          'An action can be wise, careful, and honorable even when its reception or final consequence remains uncertain. Outcome and responsibility overlap, but they are not identical.',
        contexts: ['work', 'family', 'community', 'creative', 'courage'],
        signals: ['uncertainPath', 'sharedBenefit'],
        keywords: ['submit', 'send', 'ask', 'apply', 'conversation', 'share', 'publish'],
        practices: [
          'Acknowledge the quality of the action before waiting for someone else to validate it.',
          'Prepare for the response without pretending you can own another person’s choice.',
        ],
        tones: tones(
          'You completed your part with care; you do not have to control the response to honor that.',
          'The action is complete even though the final outcome remains open.',
          'You did what was yours. Release what was never yours to command.',
          'Action delivered; the future can answer in its own time.',
          'Integrity belongs to the manner of choosing and acting, not to a promise that the world will obey.',
        ),
      },
      {
        id: 'epictetus-examine-the-impression',
        title: 'The first interpretation is not the final truth',
        summary:
          'An immediate impression can be noticed before it is accepted as a complete judgment. That pause preserves the possibility of a response based on evidence and values.',
        contexts: ['growth', 'family', 'work', 'courage', 'transition'],
        signals: ['uncertainPath', 'identityAligned'],
        keywords: ['review', 'rethink', 'respond', 'feedback', 'conflict', 'decision'],
        practices: [
          'State the observable facts separately from the first story attached to them.',
          'Choose the judgment that best supports an honest and responsible next action.',
        ],
        tones: tones(
          'You gave yourself enough pause to choose a response instead of being carried by the first reaction.',
          'This action reflects judgment examined rather than impulse obeyed.',
          'You checked the story, found the facts, and acted from there.',
          'Reaction paused; agency returned; action completed.',
          'Between an impression and assent lies a small but consequential field of freedom.',
        ),
      },
      {
        id: 'epictetus-honor-the-present-role',
        title: 'The present role is answered through present conduct',
        summary:
          'Roles do not define the whole person, but they carry real responsibilities. Fulfilling a chosen or necessary role with integrity can express character in practical form.',
        contexts: ['work', 'family', 'caregiving', 'community', 'home'],
        signals: ['sharedBenefit', 'highPriority', 'identityAligned'],
        keywords: ['role', 'parent', 'team', 'client', 'care', 'duty', 'commitment'],
        practices: [
          'Name the value you wanted to embody in this role and the behavior that expressed it.',
          'Keep the role in proportion: honor its responsibility without reducing your entire identity to it.',
        ],
        tones: tones(
          'You met a real responsibility without needing it to define your whole worth.',
          'This completion expressed integrity within a role that matters.',
          'You answered the responsibility with conduct, not merely intention.',
          'Role honored, commitment moved, character made visible.',
          'A role becomes honorable through the quality of presence and action brought to it.',
        ),
      },
    ],
  ),
  ...lens(
    'frankl',
    'Viktor Frankl',
    'A non-clinical adaptation of logotherapy themes: meaning, responsibility, self-transcendence, and the freedom to choose a response within real limits.',
    [
      {
        id: 'frankl-meaning-calls-for-response',
        title: 'Meaning becomes concrete through response',
        summary:
          'Meaning is not only discovered in reflection. It is answered through work, relationship, creativity, and the stance taken toward circumstances that cannot simply be removed.',
        contexts: ['work', 'family', 'creative', 'community', 'courage', 'growth'],
        signals: ['goalAligned', 'sharedBenefit', 'identityAligned'],
        keywords: ['meaning', 'purpose', 'serve', 'create', 'relationship', 'responsibility'],
        practices: [
          'Name the person, value, or future possibility this completed action served.',
          'Let the next action answer the situation rather than waiting for meaning to arrive as a feeling.',
        ],
        tones: tones(
          'You answered something meaningful through a real action.',
          'This completion connected responsibility with purpose.',
          'You gave meaning a behavior instead of leaving it as an idea.',
          'Purpose moved through action and became evidence.',
          'Meaning often becomes visible where a person responds responsibly to the particular demand of a real moment.',
        ),
      },
      {
        id: 'frankl-chosen-attitude',
        title: 'A chosen stance can preserve dignity inside limitation',
        summary:
          'Freedom is never unlimited, and suffering should not be romanticized. Even within genuine constraint, a person may retain some capacity to choose the manner of the next response.',
        contexts: ['health', 'caregiving', 'recovery', 'courage', 'transition'],
        signals: ['longCarried', 'returning', 'restorative'],
        keywords: ['constraint', 'difficult', 'recover', 'care', 'loss', 'limit', 'return'],
        practices: [
          'Identify the smallest remaining freedom in the situation and use it without denying the constraint.',
          'Choose a stance that protects dignity, truth, and the next responsible action.',
        ],
        tones: tones(
          'The limits were real, and you still found one humane freedom within them.',
          'You could not control every condition, but you chose the quality of this response.',
          'Constraint did not erase your responsibility or your dignity.',
          'A real limit met a real choice, and the choice moved.',
          'Human freedom may become narrow under pressure without becoming entirely absent.',
        ),
      },
      {
        id: 'frankl-purpose-beyond-self',
        title: 'Purpose can reach beyond self-preoccupation',
        summary:
          'Meaning frequently emerges through devotion to a person, a work, or a cause beyond the isolated self. Service can widen the horizon in which effort is understood.',
        contexts: ['family', 'caregiving', 'community', 'work', 'creative'],
        signals: ['sharedBenefit', 'goalAligned'],
        keywords: ['service', 'support', 'community', 'family', 'cause', 'team', 'care'],
        practices: [
          'Recognize who or what receives greater possibility because you completed this.',
          'Keep service voluntary and bounded enough that it does not require self-erasure.',
        ],
        tones: tones(
          'Your effort supported something beyond your own immediate comfort.',
          'This work gained meaning through what and whom it served.',
          'You placed action in service of a value larger than convenience.',
          'Your completion carried benefit beyond the checkbox.',
          'The self can become more fully itself by entering a responsible relationship with work, love, and service beyond itself.',
        ),
      },
      {
        id: 'frankl-life-answered-by-action',
        title: 'Responsibility answers the question of the moment',
        summary:
          'Instead of asking only what life should provide, a person can ask what this particular moment requires from them. The answer is given through concrete conduct.',
        contexts: broadContexts,
        signals: ['highPriority', 'firstToday', 'goalAligned'],
        keywords: ['responsibility', 'next', 'required', 'commitment', 'answer', 'action'],
        practices: [
          'Frame the next step as a specific responsibility the situation is placing before you.',
          'Keep the answer proportionate; responsibility is not a demand to solve everything at once.',
        ],
        tones: tones(
          'You answered this moment with one responsible act.',
          'This completion was a practical response to what the situation asked of you.',
          'You stopped waiting for the moment to explain itself and answered through action.',
          'Question met. Responsibility answered. Movement created.',
          'A life of meaning is composed of particular moments answered with particular acts of responsibility.',
        ),
      },
    ],
  ),
  ...lens(
    'james',
    'William James',
    'A practical adaptation of James on habit, attention, will, action, and pragmatic testing through lived consequences.',
    [
      {
        id: 'james-habit-makes-the-path',
        title: 'Repeated action makes future action easier',
        summary:
          'Habit gradually links cues and responses so that useful behavior requires less conscious negotiation. Repetition can conserve attention for more difficult choices.',
        contexts: ['health', 'education', 'home', 'focus', 'growth', 'work'],
        signals: ['steadyPractice', 'firstToday'],
        keywords: ['habit', 'routine', 'repeat', 'daily', 'practice', 'consistency'],
        practices: [
          'Preserve the cue, sequence, or environment that helped this action begin.',
          'Repeat the behavior before the pathway has to be rebuilt from zero.',
        ],
        tones: tones(
          'You are making the next repetition a little less demanding.',
          'This completion strengthens a pathway that can carry future action more easily.',
          'Repetition is reducing the amount of debate required next time.',
          'Path reinforced. Future action just gained support.',
          'Character is influenced by the pathways repeated conduct makes increasingly available.',
        ),
      },
      {
        id: 'james-attention-shapes-experience',
        title: 'Attention helps determine which part of reality becomes actionable',
        summary:
          'Attention cannot include everything at once. Deliberately selecting one meaningful object can organize perception, effort, and memory around something that can actually be completed.',
        contexts: ['focus', 'education', 'creative', 'work', 'planning'],
        signals: ['focused', 'learningProgress', 'creativeOutput'],
        keywords: ['attention', 'focus', 'concentrate', 'study', 'observe', 'review'],
        practices: [
          'Name what you deliberately excluded so this task could receive enough attention.',
          'Choose the next object of attention before distraction chooses it for you.',
        ],
        tones: tones(
          'You gave one meaningful thing enough attention to become complete.',
          'Selected attention organized this effort into a finished result.',
          'You chose the object, held the focus, and produced the evidence.',
          'Attention landed, effort gathered, progress appeared.',
          'Experience takes shape partly through what consciousness repeatedly selects and sustains.',
        ),
      },
      {
        id: 'james-action-before-motivation',
        title: 'Action can precede the feeling of readiness',
        summary:
          'Feeling and action influence one another. A person need not wait for ideal motivation before performing a modest behavior that can change the conditions of the next moment.',
        contexts: ['general', 'health', 'education', 'work', 'courage'],
        signals: ['delayed', 'returning', 'firstToday'],
        keywords: ['start', 'motivation', 'begin', 'delayed', 'return', 'small step'],
        practices: [
          'Use a small physical beginning to invite motivation instead of demanding motivation as an entrance fee.',
          'Remember which first movement changed the emotional temperature of the task.',
        ],
        tones: tones(
          'You did not have to feel completely ready before beginning.',
          'Action changed the conditions that waiting alone could not change.',
          'You moved first and let motivation catch up.',
          'Movement came before mood, and momentum followed.',
          'Sometimes the feeling appropriate to action is strengthened by performing the action that the situation already warrants.',
        ),
      },
      {
        id: 'james-pragmatic-test',
        title: 'An idea earns trust through consequences in lived experience',
        summary:
          'Plans and beliefs become more informative when tested in practice. Results can refine the next decision without requiring the first attempt to be flawless.',
        contexts: ['creative', 'planning', 'work', 'education', 'growth'],
        signals: ['creativeOutput', 'learningProgress', 'uncertainPath'],
        keywords: ['test', 'prototype', 'experiment', 'try', 'review', 'draft', 'iterate'],
        practices: [
          'Identify what this attempt taught that speculation could not settle.',
          'Keep the part that worked, revise the part that did not, and test again.',
        ],
        tones: tones(
          'You learned from contact with reality, not merely from prediction.',
          'This completed test produced information the next step can use.',
          'You put the idea under load and gained real evidence.',
          'Hypothesis tested. Evidence gained. Next version empowered.',
          'The practical meaning of an idea becomes clearer through the difference it makes when lived and tested.',
        ),
      },
    ],
  ),
  ...lens(
    'campbell',
    'Joseph Campbell',
    'A practical adaptation of Campbell on separation, thresholds, trials, transformation, and returning with something that can serve the wider community.',
    [
      {
        id: 'campbell-cross-the-threshold',
        title: 'Beginning crosses a real threshold',
        summary:
          'A threshold separates familiar possibility from lived experience. Crossing it does not guarantee ease; it changes the person from someone considering the path into someone already traveling it.',
        contexts: ['transition', 'creative', 'education', 'courage', 'growth'],
        signals: ['firstToday', 'identityAligned', 'uncertainPath'],
        keywords: ['begin', 'first', 'submit', 'launch', 'start', 'threshold', 'new'],
        practices: [
          'Name the boundary this action crossed and what is now possible on the other side.',
          'Treat uncertainty after the threshold as part of participation, not evidence that beginning was a mistake.',
        ],
        tones: tones(
          'You crossed into the work gently but genuinely.',
          'This action moved you from preparing for the path to inhabiting it.',
          'The threshold is behind you because you acted.',
          'You crossed the line where possibility becomes journey.',
          'A threshold matters because crossing it reorganizes the relation between the traveler and the unknown.',
        ),
      },
      {
        id: 'campbell-road-of-trials',
        title: 'Trials can develop the capacity the journey requires',
        summary:
          'Difficulty is not automatically noble, and needless suffering should not be preserved. Yet real challenges can reveal, train, and reorganize capacities that ease would leave unused.',
        contexts: ['courage', 'education', 'work', 'health', 'creative'],
        signals: ['highPriority', 'delayed', 'longCarried', 'learningProgress'],
        keywords: ['difficult', 'challenge', 'practice', 'exam', 'deadline', 'hard'],
        practices: [
          'Identify the capability this challenge required you to practice.',
          'Carry the lesson forward without glorifying the difficulty that made it necessary.',
        ],
        tones: tones(
          'You met a real trial and gained evidence of a capacity you can use again.',
          'The challenge asked for development, and this completion shows development occurring.',
          'You did not merely endure the trial; you extracted usable strength from it.',
          'Trial crossed. Capacity expanded. The journey changed.',
          'A trial becomes developmental when its difficulty is transformed into knowledge, skill, or a deeper capacity to respond.',
        ),
      },
      {
        id: 'campbell-return-with-the-boon',
        title: 'Growth becomes fuller when it returns as contribution',
        summary:
          'The journey is incomplete if every gain remains private. Knowledge, healing, craft, or courage can return to ordinary life as something that supports other people.',
        contexts: ['community', 'family', 'caregiving', 'creative', 'work'],
        signals: ['sharedBenefit', 'milestone', 'goalAligned'],
        keywords: ['share', 'teach', 'support', 'deliver', 'publish', 'community', 'team'],
        practices: [
          'Name the usable benefit this completion can now return to someone else.',
          'Translate what you learned into a form another person can receive without requiring them to repeat your whole journey.',
        ],
        tones: tones(
          'What you gained can now become useful beyond you.',
          'This completion carries something back into shared life.',
          'You turned private effort into a result others can use.',
          'The journey produced a boon, and the boon is ready to travel outward.',
          'Transformation reaches its social meaning when what was gained in difficulty returns as nourishment for the common world.',
        ),
      },
      {
        id: 'campbell-becoming-through-journey',
        title: 'The traveler is changed by the path actually taken',
        summary:
          'Development is not only the acquisition of a result. Choices, trials, helpers, revisions, and returns gradually alter the capacities and identity of the person doing the work.',
        contexts: ['growth', 'transition', 'education', 'creative', 'general'],
        signals: ['milestone', 'identityAligned', 'steadyPractice'],
        keywords: ['journey', 'growth', 'milestone', 'complete', 'learn', 'become'],
        practices: [
          'Compare the capacity you have now with the one available when this work began.',
          'Let the next challenge meet the person this journey has already helped develop.',
        ],
        tones: tones(
          'The path has been shaping you as surely as you have been shaping the work.',
          'This completion records both an external result and an internal development.',
          'You are not the same participant who first opened this task.',
          'The work moved forward, and the traveler gained form along with it.',
          'A journey changes its traveler through the accumulated reality of choices made, trials met, and meanings carried home.',
        ),
      },
    ],
  ),
  ...lens(
    'aurelius',
    'Marcus Aurelius',
    'A practical adaptation of the Meditations on present duty, proportion, cooperation, and turning obstacles into material for virtuous action.',
    [
      {
        id: 'aurelius-present-work',
        title: 'The present action is where character becomes visible',
        summary:
          'The past cannot be performed again and the future cannot yet be executed. Character is expressed through the quality brought to the responsibility available now.',
        contexts: broadContexts,
        signals: ['highPriority', 'firstToday', 'focused'],
        keywords: ['today', 'now', 'priority', 'duty', 'responsibility', 'focus'],
        practices: [
          'Return attention from the imagined total burden to the action that can be performed now.',
          'Complete the next duty with care, without requiring the whole future to become certain first.',
        ],
        tones: tones(
          'You gave this present responsibility the care it could receive today.',
          'Character became practical through the way you handled the work in front of you.',
          'You returned to the present duty and completed it.',
          'The present asked for action, and you answered.',
          'A life is encountered one present responsibility at a time, and this one now carries the mark of your conduct.',
        ),
      },
      {
        id: 'aurelius-obstacle-becomes-material',
        title: 'An obstacle can become material for the next virtue',
        summary:
          'An obstruction is not automatically beneficial, but it can supply the exact conditions in which patience, ingenuity, courage, restraint, or cooperation must be practiced.',
        contexts: ['courage', 'work', 'health', 'transition', 'planning'],
        signals: ['delayed', 'longCarried', 'uncertainPath'],
        keywords: ['obstacle', 'problem', 'delay', 'blocked', 'difficult', 'repair'],
        practices: [
          'Name the capacity the obstacle required instead of praising the obstacle itself.',
          'Use the information in the resistance to improve the next route.',
        ],
        tones: tones(
          'You met the obstruction without needing to pretend it was easy or desirable.',
          'The obstacle became usable material for a stronger response.',
          'You converted resistance into action.',
          'Blockage met ingenuity, and movement won ground.',
          'What obstructs one form of action can become the condition that calls another capacity into conscious use.',
        ),
      },
    ],
  ),
  ...lens(
    'aristotle',
    'Aristotle',
    'A practical adaptation of the Nicomachean Ethics on practiced character, purpose, proportion, friendship, and flourishing through activity.',
    [
      {
        id: 'aristotle-character-through-practice',
        title: 'Character is practiced through repeated conduct',
        summary:
          'Virtue is not merely possessed as an opinion. Qualities such as courage, generosity, honesty, and patience become reliable through repeated actions performed in real situations.',
        contexts: ['growth', 'family', 'work', 'community', 'courage'],
        signals: ['steadyPractice', 'identityAligned', 'sharedBenefit'],
        keywords: ['practice', 'character', 'courage', 'honesty', 'patience', 'habit'],
        practices: [
          'Name the quality this behavior practiced, not only the task it completed.',
          'Repeat the conduct in a form sustainable enough to become more reliable.',
        ],
        tones: tones(
          'You practiced a quality you want to become more dependable within you.',
          'This action contributed to character through conduct, not declaration.',
          'You practiced the virtue instead of merely admiring it.',
          'Quality embodied. Character strengthened through use.',
          'We become more capable of a virtue by repeatedly giving it form in the situations where it is required.',
        ),
      },
      {
        id: 'aristotle-proportionate-response',
        title: 'A good response fits the real situation',
        summary:
          'Wise action is rarely defined by maximum intensity. It seeks an appropriate measure for this person, purpose, moment, and consequence.',
        contexts: ['planning', 'health', 'finance', 'family', 'recovery'],
        signals: ['restorative', 'foundationBuilding', 'uncertainPath'],
        keywords: ['balance', 'enough', 'measure', 'budget', 'pace', 'priority'],
        practices: [
          'Ask whether the effort, urgency, and scope fit the actual stakes.',
          'Choose the sustainable measure between neglect and excess.',
        ],
        tones: tones(
          'You found a response that respected both the need and your limits.',
          'The action was proportionate to the situation and therefore more sustainable.',
          'You used the needed measure instead of confusing excess with excellence.',
          'Right-sized effort produced real movement.',
          'Practical wisdom searches for the fitting response, not for an abstract maximum detached from circumstance.',
        ),
      },
    ],
  ),
  ...lens(
    'rogers',
    'Carl Rogers',
    'A non-clinical adaptation of person-centered principles: congruence, empathic understanding, unconditional human worth, and growth supported by honest acceptance.',
    [
      {
        id: 'rogers-congruence',
        title: 'Growth strengthens when inner values and outward action agree',
        summary:
          'Congruence means reducing the gap between what is genuinely experienced, what is consciously acknowledged, and what is expressed through action.',
        contexts: ['growth', 'family', 'courage', 'work', 'transition'],
        signals: ['goalAligned', 'identityAligned'],
        keywords: ['honest', 'authentic', 'values', 'boundary', 'conversation', 'choice'],
        practices: [
          'Notice whether this action expressed what you actually value rather than only what you thought you should appear to value.',
          'Carry the same honesty into the next choice without using honesty as permission for cruelty.',
        ],
        tones: tones(
          'You let an honest part of your experience have a safe place in action.',
          'This completion brought experience, values, and behavior into closer agreement.',
          'You acted from what was real instead of maintaining an empty appearance.',
          'Inner truth met outward action and became congruent movement.',
          'Growth becomes more possible as the distance narrows between lived experience, conscious acknowledgment, and chosen expression.',
        ),
      },
      {
        id: 'rogers-worth-before-performance',
        title: 'Human worth does not begin after achievement',
        summary:
          'Recognition can honor real effort without making dignity conditional on output. Acceptance creates safer ground from which responsibility and development can continue.',
        contexts: ['health', 'recovery', 'growth', 'caregiving', 'general'],
        signals: ['restorative', 'returning', 'firstToday'],
        keywords: ['worth', 'accept', 'care', 'rest', 'return', 'small'],
        practices: [
          'Recognize the completed effort without turning it into a verdict on your total worth.',
          'Let acceptance support the next responsibility rather than cancel it.',
        ],
        tones: tones(
          'This progress deserves recognition, and your worth did not wait for it to become real.',
          'The completion matters without becoming the price of your dignity.',
          'Honor the result. Refuse to make achievement the condition for being human.',
          'Progress gained; dignity unchanged and intact.',
          'Acceptance and accountability can share the same ground when worth is not made hostage to performance.',
        ),
      },
    ],
  ),
  ...lens(
    'maslow',
    'Abraham Maslow',
    'A practical adaptation of humanistic psychology on needs, growth, self-actualization, and the conditions that make higher development more available.',
    [
      {
        id: 'maslow-foundations-support-growth',
        title: 'Growth is supported by foundations, not separated from them',
        summary:
          'Sleep, safety, belonging, stability, and practical care are not lesser concerns. Attending to foundational needs can expand the capacity available for creativity, purpose, and growth.',
        contexts: ['health', 'home', 'finance', 'family', 'recovery', 'planning'],
        signals: ['foundationBuilding', 'restorative', 'sharedBenefit'],
        keywords: ['sleep', 'food', 'home', 'budget', 'safety', 'support', 'stability'],
        practices: [
          'Identify which larger capacity this foundational action helps make available.',
          'Treat maintenance as part of development rather than an interruption of it.',
        ],
        tones: tones(
          'You cared for a foundation that helps the rest of you grow.',
          'This practical completion increased the support available for higher aims.',
          'You strengthened the base instead of demanding growth from instability.',
          'Foundation secured; more of your capacity can rise from it.',
          'Human possibility is easier to cultivate when the needs carrying it are acknowledged rather than treated as distractions.',
        ),
      },
      {
        id: 'maslow-growth-choice',
        title: 'Development is renewed through small growth-oriented choices',
        summary:
          'Self-actualization is not a permanent status. It is supported by repeated moments in which a person chooses learning, honesty, creativity, or responsibility over avoidable contraction.',
        contexts: ['growth', 'creative', 'education', 'courage', 'transition'],
        signals: ['identityAligned', 'learningProgress', 'creativeOutput'],
        keywords: ['grow', 'learn', 'create', 'choice', 'potential', 'develop'],
        practices: [
          'Name the capacity this choice allowed you to exercise.',
          'Choose the next growth step small enough to remain connected to reality.',
        ],
        tones: tones(
          'You gave a growing capacity room to emerge.',
          'This completion was a practical choice in favor of development.',
          'You used potential instead of merely claiming it.',
          'Growth chose action and became visible.',
          'Development is renewed through particular choices that permit more of a person’s capacities to enter responsible use.',
        ),
      },
    ],
  ),
  ...lens(
    'kierkegaard',
    'Søren Kierkegaard',
    'A practical adaptation of Kierkegaard on choice, anxiety, inward responsibility, commitment, and becoming a self without demanding certainty.',
    [
      {
        id: 'kierkegaard-choice-shapes-self',
        title: 'Choice participates in the making of a self',
        summary:
          'A significant choice does more than select an outcome. It expresses and gradually forms the person willing to take responsibility for that direction.',
        contexts: ['growth', 'courage', 'transition', 'family', 'work'],
        signals: ['identityAligned', 'goalAligned', 'highPriority'],
        keywords: ['choice', 'commit', 'decide', 'identity', 'direction', 'responsibility'],
        practices: [
          'Name what this choice says about the responsibility you are willing to carry.',
          'Revisit the commitment through action so it becomes more than a dramatic moment.',
        ],
        tones: tones(
          'You chose a direction with care and allowed that choice to shape you.',
          'This action expressed a self taking responsibility for its direction.',
          'You made the choice real by carrying it into conduct.',
          'Decision became commitment; commitment became movement.',
          'A self is not only discovered behind choices; it is also formed through the choices for which one becomes responsible.',
        ),
      },
      {
        id: 'kierkegaard-courage-without-certainty',
        title: 'Commitment can move before certainty is complete',
        summary:
          'Anxiety can accompany genuine possibility because a choice matters and cannot be guaranteed in advance. Courage acts responsibly without pretending uncertainty has vanished.',
        contexts: ['courage', 'transition', 'creative', 'family', 'general'],
        signals: ['uncertainPath', 'delayed', 'firstToday'],
        keywords: ['uncertain', 'anxious', 'risk', 'begin', 'decide', 'unknown'],
        practices: [
          'Distinguish the uncertainty that belongs to possibility from a concrete danger that requires protection.',
          'Take the smallest responsible commitment that does not require false certainty.',
        ],
        tones: tones(
          'You moved with uncertainty present and did not punish yourself for feeling its weight.',
          'This action carried commitment without demanding impossible certainty.',
          'You chose responsibly before every doubt was settled.',
          'Uncertainty stayed; courage moved anyway.',
          'Possibility can produce anxiety precisely because freedom must choose without receiving a complete guarantee in advance.',
        ),
      },
    ],
  ),
  ...lens(
    'emerson',
    'Ralph Waldo Emerson',
    'A practical adaptation of Emerson on self-reliance, inner authority, nonconformity, and bringing original capacity into useful action.',
    [
      {
        id: 'emerson-inner-authority',
        title: 'Inner authority grows through examined self-trust',
        summary:
          'Self-reliance is not isolation or infallibility. It is the willingness to examine experience, hear counsel, and still take responsibility for a choice that cannot be outsourced.',
        contexts: ['growth', 'creative', 'courage', 'transition', 'work'],
        signals: ['identityAligned', 'uncertainPath', 'goalAligned'],
        keywords: ['decide', 'original', 'voice', 'self', 'create', 'lead'],
        practices: [
          'Name the judgment you accepted as your responsibility after considering the available counsel.',
          'Keep self-trust accountable to evidence, consequences, and the dignity of other people.',
        ],
        tones: tones(
          'You listened inwardly without closing yourself to reality or care.',
          'This completion strengthened responsible trust in your own considered judgment.',
          'You stopped outsourcing the choice and owned it.',
          'Your own voice entered the work and produced a result.',
          'Inner authority becomes trustworthy when originality, responsibility, evidence, and regard for others remain in conversation.',
        ),
      },
      {
        id: 'emerson-original-contribution',
        title: 'Original contribution requires expression, not permission alone',
        summary:
          'A person’s distinct perception or capacity becomes socially meaningful when it is developed into work that can be encountered, questioned, and used.',
        contexts: ['creative', 'work', 'education', 'community', 'courage'],
        signals: ['creativeOutput', 'sharedBenefit', 'identityAligned'],
        keywords: ['original', 'create', 'publish', 'design', 'idea', 'voice', 'share'],
        practices: [
          'Identify the part of this work that could only have arrived through your particular attention and experience.',
          'Make the contribution clear enough that others can engage it without requiring their approval to create it.',
        ],
        tones: tones(
          'You gave your distinct contribution a form the world can now meet.',
          'Original perception became useful through completed expression.',
          'You made the work instead of waiting for permission to possess your own voice.',
          'A singular idea crossed into shared reality.',
          'Individual insight becomes contribution when it accepts the discipline of form and enters a world where others may respond.',
        ),
      },
    ],
  ),
  ...lens(
    'buber',
    'Martin Buber',
    'A practical adaptation of dialogical philosophy on genuine encounter, presence, mutuality, and treating people as subjects rather than instruments.',
    [
      {
        id: 'buber-person-before-function',
        title: 'A person is more than the function they perform',
        summary:
          'Human relationships become distorted when another person is treated only as a task, obstacle, customer, dependent, or resource. Genuine encounter restores subjecthood without erasing practical roles.',
        contexts: ['family', 'caregiving', 'community', 'work', 'courage'],
        signals: ['sharedBenefit', 'identityAligned'],
        keywords: ['person', 'conversation', 'care', 'client', 'team', 'relationship'],
        practices: [
          'Recognize the person affected by the task as more than the role through which the task reached you.',
          'Let efficiency serve the relationship rather than flatten it.',
        ],
        tones: tones(
          'You carried out the responsibility while keeping a human being visible within it.',
          'This action joined practical care with recognition of the person it served.',
          'You handled the task without reducing the person to the task.',
          'Work completed; humanity kept present.',
          'A relationship becomes more fully human when each person is encountered as a presence rather than merely used as a function.',
        ),
      },
      {
        id: 'buber-presence-creates-relationship',
        title: 'Presence is an active contribution to relationship',
        summary:
          'Genuine dialogue requires more than words. Attention, responsiveness, and willingness to be affected help create a meeting in which both people remain real.',
        contexts: ['family', 'caregiving', 'community', 'work', 'growth'],
        signals: ['sharedBenefit', 'focused'],
        keywords: ['listen', 'call', 'visit', 'conversation', 'meeting', 'support'],
        practices: [
          'Notice where listening changed the response you were prepared to give.',
          'Carry one specific sign of presence into the next interaction: attention, a question, or an honest response.',
        ],
        tones: tones(
          'You offered another person the care of genuine attention.',
          'This completion strengthened relationship through presence, not contact alone.',
          'You showed up as a person, not merely as a function.',
          'Attention met attention and made the connection more real.',
          'Relationship becomes alive where presence is offered and another person is permitted to affect the shape of the encounter.',
        ),
      },
    ],
  ),
  ...lens(
    'weil',
    'Simone Weil',
    'A practical adaptation of Weil on attention, obligation, affliction, truthfulness, and care that does not consume or appropriate the person receiving it.',
    [
      {
        id: 'weil-attention-as-care',
        title: 'Attention can be a disciplined form of care',
        summary:
          'Care is strengthened by the willingness to perceive what is actually present before rushing to impose an answer. Attention creates room for truth, need, and another person to become more visible.',
        contexts: ['caregiving', 'family', 'community', 'education', 'health'],
        signals: ['sharedBenefit', 'focused', 'learningProgress'],
        keywords: ['listen', 'observe', 'study', 'care', 'review', 'understand'],
        practices: [
          'Identify what became visible only because you stayed with the reality long enough to notice it.',
          'Let the next response be shaped by what was observed rather than by the desire to appear helpful.',
        ],
        tones: tones(
          'You gave careful attention to something that deserved not to be rushed past.',
          'Attention allowed the real need or truth of the task to guide the response.',
          'You looked closely enough to act on reality instead of assumption.',
          'Attention deepened; the response became more precise and humane.',
          'The quality of attention can become an ethical act when it allows reality and another person to appear without being immediately overwritten.',
        ),
      },
      {
        id: 'weil-obligation-before-applause',
        title: 'A real obligation does not depend on applause',
        summary:
          'Some responsibilities arise from another person’s vulnerability or from the truth of a situation. Their value is not created by recognition, status, or reward.',
        contexts: ['caregiving', 'community', 'family', 'work', 'home'],
        signals: ['sharedBenefit', 'highPriority', 'foundationBuilding'],
        keywords: ['care', 'duty', 'support', 'maintenance', 'protect', 'help'],
        practices: [
          'Name the real need this action answered even if no one noticed.',
          'Keep the obligation bounded by truth: care does not require claiming every burden as yours.',
        ],
        tones: tones(
          'You answered a need whose reality did not depend on anyone praising you for it.',
          'This completion honored an obligation grounded in care rather than recognition.',
          'You did the necessary work without making applause its purpose.',
          'Need answered. Care delivered. Recognition optional.',
          'Obligation acquires moral weight from the reality it answers, not from the status awarded to the person who responds.',
        ),
      },
    ],
  ),
];
