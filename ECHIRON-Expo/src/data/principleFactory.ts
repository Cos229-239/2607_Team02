import type { EncouragementPrinciple } from '@/data/encouragementLibrary';
import type { EncouragementTone } from '@/types/models';

export type PrincipleSeed = Omit<
  EncouragementPrinciple,
  'sourceId' | 'sourceLabel' | 'sourceNote' | 'tones'
> & {
  phrases: [string, string, string, string, string];
};

const toneOrder: EncouragementTone[] = [
  'gentle',
  'balanced',
  'direct',
  'energetic',
  'reflective',
];

export function defineLens(
  sourceId: string,
  sourceLabel: string,
  sourceNote: string,
  seeds: PrincipleSeed[],
): EncouragementPrinciple[] {
  return seeds.map(({ phrases, ...seed }) => ({
    ...seed,
    sourceId,
    sourceLabel,
    sourceNote,
    tones: Object.fromEntries(
      toneOrder.map((tone, index) => [tone, phrases[index]]),
    ) as Record<EncouragementTone, string>,
  }));
}
