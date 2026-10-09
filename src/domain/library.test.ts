import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';

import {
  insightItem,
  librarySections,
  libraryItems,
  pickedForAge,
  readingMinutes,
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
