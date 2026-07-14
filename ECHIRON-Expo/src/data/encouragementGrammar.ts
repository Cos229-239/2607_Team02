import type { EncouragementSignal } from '@/data/encouragementLibrary';
import type { EncouragementTone, PlanningStyle } from '@/types/models';

export const signalEvidence: Record<EncouragementSignal, string[]> = {
  highPriority: [
    'You gave a consequential responsibility the attention it required.',
    'This was not merely busywork; it carried real priority.',
    'You directed effort toward something with meaningful stakes.',
  ],
  delayed: [
    'The delay did not remove your ability to return and finish.',
    'An overdue task became a completed fact.',
    'You closed something that had been carrying extra mental weight.',
  ],
  firstToday: [
    'This gives today its first concrete evidence of movement.',
    'You established a beginning that the rest of the day can build on.',
    'The day now contains one finished action, not only intentions.',
  ],
  milestone: [
    'This completion belongs to a larger pattern you have been building.',
    'Another threshold in the work is now behind you.',
    'The accumulation is visible: repeated actions are becoming a body of evidence.',
  ],
  returning: [
    'You came back without requiring the interruption to disappear from the story.',
    'The gap did not get the final word; your return did.',
    'You restored continuity through return rather than through a perfect streak.',
  ],
  goalAligned: [
    'This also supports a direction you have named for yourself.',
    'The action and one of your stated goals point the same way.',
    'You connected today’s effort to a future you consciously chose.',
  ],
  focused: [
    'You protected finite attention long enough to produce a result.',
    'Concentration became finished work instead of remaining an intention.',
    'You gave one worthwhile thing an undivided interval.',
  ],
  longCarried: [
    'You put down part of a burden that had been open for a long time.',
    'The duration of the struggle makes honest completion worth recognizing.',
    'Something long carried is lighter because you acted on it.',
  ],
  steadyPractice: [
    'This repetition strengthens a practice without demanding perfection from it.',
    'You added another credible repetition to a developing pattern.',
    'Consistency became visible in one ordinary, repeatable action.',
  ],
  sharedBenefit: [
    'The benefit of this action extends beyond you alone.',
    'Your follow-through strengthens a relationship or shared effort.',
    'You made contribution tangible for someone else as well as yourself.',
  ],
  foundationBuilding: [
    'This kind of groundwork makes later action easier and more stable.',
    'You strengthened the conditions that future progress depends on.',
    'A supporting piece is now in place beneath the more visible work.',
  ],
  restorative: [
    'You treated restoration as a legitimate part of sustainable progress.',
    'This action protected the capacity that all other effort relies on.',
    'You made room for renewal without turning depletion into a virtue.',
  ],
  creativeOutput: [
    'An idea now exists in a form that can be seen, used, tested, or refined.',
    'You moved creative work from possibility into material reality.',
    'The work has another finished piece because you gave imagination form.',
  ],
  learningProgress: [
    'You now have specific evidence of a skill being practiced or developed.',
    'Learning crossed from exposure into use.',
    'This completion gives capability another experience to build from.',
  ],
  uncertainPath: [
    'You did not require total certainty before making a responsible move.',
    'Uncertainty remained present, but it no longer prevented all action.',
    'You answered an unclear situation with one observable step.',
  ],
  identityAligned: [
    'The action reflects a quality you want your life to embody.',
    'You practiced an identity through behavior rather than through a label.',
    'Who you intend to become gained a small piece of lived evidence.',
  ],
};

export const toneClosings: Record<EncouragementTone, string[]> = {
  gentle: [
    'Let that be enough evidence for this moment.',
    'You can receive the win without asking it to prove everything.',
    'Take a breath and allow the completion to count.',
    'A kind next step can grow from here.',
  ],
  balanced: [
    'Keep the evidence and choose the next useful step when you are ready.',
    'The completion is real, and it can inform what comes next.',
    'Recognize the result without inflating or minimizing it.',
    'Use what worked here as information for the next decision.',
  ],
  direct: [
    'Count the result, learn from it, and choose the next move.',
    'Keep the evidence; drop the exaggeration.',
    'You finished this. Decide what deserves attention next.',
    'Let completed action—not self-criticism—set the next direction.',
  ],
  energetic: [
    'Carry the useful part of that momentum forward.',
    'The path has movement now—use it wisely.',
    'That is real traction. Build from it.',
    'One finished action just made the next one easier to enter.',
  ],
  reflective: [
    'Notice what this reveals about the way you move forward.',
    'The meaning lies not only in finishing, but in how you met the task.',
    'Let the action revise the story you tell about your capacity.',
    'This is one small fact from which a more honest self-understanding can grow.',
  ],
};

export const planningClosings: Record<PlanningStyle, string[]> = {
  structured: [
    'Record what worked and define the next observable action.',
    'Give the next step a clear scope and a place on the plan.',
  ],
  balanced: [
    'Keep a direction, then adjust the method as reality teaches you.',
    'Choose a useful next step without demanding the whole path at once.',
  ],
  flexible: [
    'Preserve the direction and let the next form remain adaptable.',
    'Follow what this completion clarified without forcing a rigid sequence.',
  ],
};

export const nameOpeners = [
  (name: string, lead: string) => `${name}, ${lead.charAt(0).toLowerCase()}${lead.slice(1)}`,
  (name: string, lead: string) => `${lead} Take that in, ${name}.`,
  (name: string, lead: string) => `${lead} ${name}, this one deserves an honest acknowledgment.`,
];

export const contextBridges = [
  'That matters here because',
  'The deeper principle is simple:',
  'What this completion demonstrates is that',
  'Seen clearly,',
];
