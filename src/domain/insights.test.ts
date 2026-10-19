import { readFileSync } from 'fs';
import { join } from 'path';

import type { Insight } from '@/content/insights';
import { insights as bundled } from '@/content/insights';
import { PLACEHOLDER_MARKER } from '@/content/schemas';

import { insightBlocks, pickDailyInsights } from './insights';

function make(id: string, extra: Partial<Insight> = {}): Insight {
  return {
    id,
    category: 'starting-solids',
    stages: ['newborn'],
    kind: 'tip',
    tone: 'surface',
    icon: 'sparkles',
    emoji: '✨',
    illustration: 'hearts',
    title: id,
    summary: id,
    body: ['[PLACEHOLDER - needs expert review] text'],
    allergens: [],
    ...extra,
  };
}

const all = [
  make('a'),
  make('b'),
  make('c'),
  make('d', { allergens: ['milk'] }),
  make('safety', { kind: 'when-to-call' }),
  make('solids-only', { stages: ['solids'] }),
];

describe('pickDailyInsights', () => {
  it('only shows insights for the current stage', () => {
    const ids = pickDailyInsights(all, 'newborn', [], '2026-01-01').map((i) => i.id);
    expect(ids).not.toContain('solids-only');
  });

  it('hides insights containing a household allergen', () => {
    const ids = pickDailyInsights(all, 'newborn', ['milk'], '2026-01-01').map((i) => i.id);
    expect(ids).not.toContain('d');
  });

  it('always includes safety items, in third place', () => {
    for (const day of ['2026-01-01', '2026-01-02', '2026-03-15']) {
      expect(pickDailyInsights(all, 'newborn', [], day, 3)[2].id).toBe('safety');
    }
  });

  it('rotates the order day by day, and is stable within a day', () => {
    const day1 = pickDailyInsights(all, 'newborn', [], '2026-01-01').map((i) => i.id);
    const day1again = pickDailyInsights(all, 'newborn', [], '2026-01-01').map((i) => i.id);
    const day2 = pickDailyInsights(all, 'newborn', [], '2026-01-02').map((i) => i.id);
    expect(day1again).toEqual(day1);
    expect(day2).not.toEqual(day1);
  });

  it('works for dates before the rotation epoch', () => {
    expect(pickDailyInsights(all, 'newborn', [], '2025-06-01').length).toBeGreaterThan(0);
  });

  it('gives every stage something from the bundled content', () => {
    for (const stage of ['newborn', 'solids', 'toddler'] as const) {
      expect(pickDailyInsights(bundled, stage, [], '2026-10-07').length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('bundled insights', () => {
  it('have unique ids and no review markers in the text', () => {
    const ids = bundled.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of bundled) {
      expect(i.body[0]).not.toContain(PLACEHOLDER_MARKER);
    }
  });

  it('use SF Symbol names that exist', () => {
    const symbols = readFileSync(
      join(__dirname, '../../node_modules/sf-symbols-typescript/dist/index.d.ts'),
      'utf8',
    );
    for (const i of bundled) expect(symbols).toContain(`'${i.icon}'`);
  });

  it('never claim a food increases milk supply', () => {
    const text = JSON.stringify(bundled).toLowerCase();
    for (const banned of [
      'milk supply',
      'boost milk',
      'increase milk',
      'galactagogue',
      'lactogenic',
    ]) {
      expect(text).not.toContain(banned);
    }
  });
});

describe('insightBlocks', () => {
  it('finds headings, bullets, numbered steps and paragraphs', () => {
    expect(
      insightBlocks([
        'Makes 1 serving. Enjoy it cold.',
        'Ingredients',
        '• 1/2 cup rolled oats',
        'How to make it',
        '1. Layer the jar: add the oats.',
        '12. Eat it.',
        'Honey is fine for you, but never for babies under 12 months.',
      ]),
    ).toEqual([
      { kind: 'paragraph', text: 'Makes 1 serving. Enjoy it cold.' },
      { kind: 'heading', text: 'Ingredients' },
      { kind: 'bullet', text: '1/2 cup rolled oats' },
      { kind: 'heading', text: 'How to make it' },
      { kind: 'step', number: 1, text: 'Layer the jar: add the oats.' },
      { kind: 'step', number: 12, text: 'Eat it.' },
      { kind: 'paragraph', text: 'Honey is fine for you, but never for babies under 12 months.' },
    ]);
  });

  it('never treats a sentence as a heading', () => {
    expect(insightBlocks(['Rest counts, too.'])[0].kind).toBe('paragraph');
    expect(insightBlocks(['A'.repeat(61)])[0].kind).toBe('paragraph');
  });
});
