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

export type InsightBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'bullet'; text: string }
  | { kind: 'step'; number: number; text: string }
  | { kind: 'paragraph'; text: string };

/**
 * Turns an insight's body lines into blocks for layout: "• " lines are bullets,
 * "1. " lines are numbered steps, and a short line with no closing punctuation
 * (like "Ingredients") is a heading. Everything else is a paragraph.
 */
export function insightBlocks(body: string[]): InsightBlock[] {
  return body.map((line): InsightBlock => {
    const text = line.trim();
    const bullet = /^•\s*(.+)$/.exec(text);
    if (bullet) return { kind: 'bullet', text: bullet[1] };
    const step = /^(\d+)\.\s+(.+)$/.exec(text);
    if (step) return { kind: 'step', number: Number(step[1]), text: step[2] };
    if (text.length <= 60 && !/[.!?:,;”"')]$/.test(text)) return { kind: 'heading', text };
    return { kind: 'paragraph', text };
  });
}
