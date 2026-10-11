import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';

import {
  forMom,
  insightItem,
  librarySections,
  libraryItems,
  pickedForAge,
  readingMinutes,
  todayRow,
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

  it('picks only items relevant now, articles first', () => {
    const picked = pickedForAge(items, 8);
    expect(picked.length).toBeGreaterThan(0);
    for (const i of picked) expect(i.fromMonths <= 8 && i.toMonths >= 8).toBe(true);
    expect(picked[0].source).toBe('article');
  });
});

describe('illustrations', () => {
  it('gives every article and insight its own illustration', () => {
    const names = [...solidsArticles, ...insights].map((x) => x.illustration);
    expect(new Set(names).size).toBe(names.length);
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
  const article = (id: string, fromMonths: number, toMonths: number) =>
    ({
      id,
      category: 'starting-solids',
      title: id,
      summary: 's',
      fromMonths,
      toMonths,
      icon: 'i',
      emoji: 'e',
      illustration: 'bowl',
      tone: 'muted',
      readMinutes: 3,
      sections: [],
      sources: [],
      reviewStatus: 'placeholder',
      reviewer: 'x',
    }) as unknown as Parameters<typeof todayRow>[1][number];

  it('puts two tips first, then age-ordered articles, then the other tips', () => {
    const row = todayRow(
      [tip('t1'), tip('t2'), tip('t3')],
      [article('later', 9, 12), article('now', 5, 8), article('soon', 7, 9)],
      6,
      2,
    );
    expect(row.map((i) => i.id)).toEqual(['t1', 't2', 'now', 'soon', 't3']);
    expect(row[2].source).toBe('article');
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
