import { illustrationNames } from '@/content/illustration-names';
import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';

import {
  forMom,
  insightItem,
  libraryItems,
  librarySections,
  pickedForAge,
  readingMinutes,
  relatedItems,
  todayRow,
  type LibraryItem,
} from './library';

describe('library content', () => {
  it('puts every article and insight in a known category, and leaves no category empty', () => {
    const ids = new Set(insightCategories.map((c) => c.id));
    const used = [...solidsArticles, ...insights].map((x) => x.category);
    for (const c of used) expect(ids.has(c)).toBe(true);
    for (const id of ids) expect(used).toContain(id);
  });

  it('has categories for both mom and baby', () => {
    const audiences = new Set(insightCategories.map((c) => c.audience));
    expect(audiences).toEqual(new Set(['mom', 'baby']));
  });
});

describe('libraryItems', () => {
  it('combines articles and insights, hiding insights with a household allergen', () => {
    const all = libraryItems(solidsArticles, insights, []);
    expect(all).toHaveLength(solidsArticles.length + insights.length);
    const withAllergen = insights.filter((i) => i.allergens.includes('milk'));
    const noMilk = libraryItems(solidsArticles, insights, ['milk']);
    expect(noMilk).toHaveLength(all.length - withAllergen.length);
  });
});

describe('insightItem', () => {
  it('maps stages to an age range', () => {
    const item = insightItem({ ...insights[0], stages: ['newborn', 'solids'] });
    expect([item.fromMonths, item.toMonths]).toEqual([0, 11]);
  });
});

describe('readingMinutes', () => {
  it('is at least a minute', () => {
    expect(readingMinutes(['short'])).toBe(1);
    expect(readingMinutes([Array(600).fill('word').join(' ')])).toBe(3);
  });
});

describe('librarySections and pickedForAge', () => {
  const items = libraryItems(solidsArticles, insights, []);

  it('keeps category order and puts age-relevant items first', () => {
    const sections = librarySections(insightCategories, items, 5);
    expect(sections[0].category.id).toBe(insightCategories[0].id);
    const solids = sections.find((s) => s.category.id === 'starting-solids')!;
    expect(solids.items[0].id).toBe('ready');
  });

  it('hides Newborn days once the baby is 6 months old', () => {
    const ids = (months: number) =>
      librarySections(insightCategories, items, months).map((s) => s.category.id);
    expect(ids(5)).toContain('newborn-days');
    expect(ids(6)).not.toContain('newborn-days');
    expect(ids(12)).not.toContain('newborn-days');
  });

  it('picks only items relevant now, articles first', () => {
    const picked = pickedForAge(items, 8);
    expect(picked.length).toBeGreaterThan(0);
    for (const i of picked) expect(i.fromMonths <= 8 && i.toMonths >= 8).toBe(true);
    expect(picked[0].source).toBe('article');
  });
});

describe('illustrations', () => {
  it('gives every article and insight a bundled illustration', () => {
    const names = [...solidsArticles, ...insights].map((x) => x.illustration);
    for (const n of names) expect(illustrationNames).toContain(n);
  });
});

describe('todayRow', () => {
  const tip = (id: string) =>
    ({
      id,
      category: 'nourishing-you',
      stages: ['solids'],
      kind: 'tip',
      tone: 'muted',
      icon: 'i',
      emoji: 'e',
      illustration: 'bowl',
      title: id,
      summary: 's',
      body: ['b'],
      allergens: [],
      reviewStatus: 'placeholder',
      reviewer: 'x',
    }) as unknown as Parameters<typeof todayRow>[0][number];
  it('puts two tips first, then the picked items, then the other tips', () => {
    const picked = libraryItems(solidsArticles, [], []).slice(0, 2);
    const row = todayRow([tip('t1'), tip('t2'), tip('t3')], picked);
    expect(row.map((i) => i.id)).toEqual(['t1', 't2', picked[0].id, picked[1].id, 't3']);
    expect(row[2].source).toBe('article');
  });

  it('shows a daily tip only once', () => {
    const row = todayRow([tip('t1')], libraryItems([], [tip('t1')], []));
    expect(row.map((i) => i.id)).toEqual(['t1']);
  });
});

describe('forMom', () => {
  it('returns only items from mom categories, in category order', () => {
    const items = libraryItems(solidsArticles, insights, []);
    const mom = forMom(items, insightCategories);
    const momIds = insightCategories.filter((c) => c.audience === 'mom').map((c) => c.id);
    expect(mom.length).toBeGreaterThan(0);
    expect(mom.every((i) => momIds.includes(i.category))).toBe(true);
    expect(mom.map((i) => momIds.indexOf(i.category))).toEqual(
      [...mom.map((i) => momIds.indexOf(i.category))].sort((a, b) => a - b),
    );
  });
});

describe('relatedItems', () => {
  const item = (id: string, category: string, from: number, to: number): LibraryItem => ({
    id,
    source: 'article',
    category,
    title: id,
    summary: id,
    tone: 'surface',
    icon: 'leaf',
    emoji: '🍃',
    illustration: illustrationNames[0],
    fromMonths: from,
    toMonths: to,
    readMinutes: 3,
  });
  const all = [
    item('a', 'starting-solids', 6, 9),
    item('b', 'starting-solids', 6, 12),
    item('c', 'safety', 6, 12),
    item('d', 'safety', 24, 36),
    item('e', 'starting-solids', 9, 12),
  ];

  it('lists the same category first, then overlapping ages, never itself', () => {
    const ids = relatedItems(all[0], all, 7).map((i) => i.id);
    expect(ids).toEqual(['b', 'e', 'c']);
  });

  it('respects the count', () => {
    expect(relatedItems(all[0], all, 7, 2)).toHaveLength(2);
  });
});
