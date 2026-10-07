import type { Insight } from '@/content/insights';

import { daysBetween, type IsoDate } from './dates';
import type { Allergen } from './profile';
import type { Stage } from './stage';

const EPOCH: IsoDate = '2026-01-01';

/**
 * Today's insights for a stage: hides anything containing a household allergen,
 * rotates everyday tips daily so the row feels fresh without being random, and
 * always includes "when to call" safety items (third in the row, so they are
 * visible without leading with something heavy).
 */
export function pickDailyInsights(
  all: Insight[],
  stage: Stage,
  avoid: Allergen[],
  onDate: IsoDate,
  count = 6,
): Insight[] {
  const eligible = all
    .filter((i) => i.stages.includes(stage))
    .filter((i) => !i.allergens.some((a) => avoid.includes(a)))
    .sort((a, b) => a.id.localeCompare(b.id));

  const safety = eligible.filter((i) => i.kind === 'when-to-call');
  const rest = eligible.filter((i) => i.kind !== 'when-to-call');
  const offset = rest.length
    ? ((daysBetween(EPOCH, onDate) % rest.length) + rest.length) % rest.length
    : 0;
  const rotated = [...rest.slice(offset), ...rest.slice(0, offset)];

  return [...rotated.slice(0, 2), ...safety, ...rotated.slice(2)].slice(0, count);
}
