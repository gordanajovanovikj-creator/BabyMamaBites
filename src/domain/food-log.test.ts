import { reactionAdvice } from '@/content/reactions';
import { PLACEHOLDER_MARKER } from '@/content/schemas';
import {
  chokingGuide,
  getSolidsSource,
  planWeeks,
  quickFoods,
  readiness,
} from '@/content/solids-plan';

import {
  allergenProgress,
  foodsTriedCount,
  makeEntry,
  planWeekFor,
  sortEntries,
  type FoodLogEntry,
} from './food-log';
import { allergens } from './profile';

const entry = (id: string, extra: Partial<FoodLogEntry> = {}): FoodLogEntry => ({
  id,
  date: '2026-10-01',
  food: id,
  allergen: null,
  isNew: true,
  reaction: 'none',
  notes: null,
  ...extra,
});

describe('allergenProgress', () => {
  it('starts with every allergen not tried', () => {
    const p = allergenProgress([]);
    expect(Object.values(p).every((s) => s === 'not-tried')).toBe(true);
    expect(Object.keys(p)).toHaveLength(allergens.length);
  });

  it('marks tried allergens, and a reaction always wins', () => {
    const p = allergenProgress([
      entry('a', { allergen: 'egg' }),
      entry('b', { allergen: 'peanut', reaction: 'mild' }),
      entry('c', { allergen: 'peanut' }),
    ]);
    expect(p.egg).toBe('tried');
    expect(p.peanut).toBe('reaction');
    expect(p.milk).toBe('not-tried');
  });
});

describe('foodsTriedCount', () => {
  it('counts distinct foods regardless of case and spacing', () => {
    expect(
      foodsTriedCount([
        entry('1', { food: 'Banana' }),
        entry('2', { food: ' banana ' }),
        entry('3', { food: 'Pear' }),
      ]),
    ).toBe(2);
  });
});

describe('sortEntries', () => {
  it('shows newest dates first', () => {
    const sorted = sortEntries([
      entry('a', { date: '2026-10-01' }),
      entry('b', { date: '2026-10-05' }),
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['b', 'a']);
  });
});

describe('planWeekFor', () => {
  it('is null before solids and clamps to the plan', () => {
    expect(planWeekFor(null, 26)).toBeNull();
    expect(planWeekFor(3, 26)).toBe(3);
    expect(planWeekFor(40, 26)).toBe(26);
  });
});

describe('makeEntry', () => {
  it('trims text and drops empty notes', () => {
    const e = makeEntry(
      {
        date: '2026-10-08',
        food: '  Egg ',
        allergen: 'egg',
        isNew: true,
        reaction: 'none',
        notes: '  ',
      },
      'id1',
    );
    expect(e).toMatchObject({ food: 'Egg', notes: null });
  });
  it('rejects empty foods and bad dates', () => {
    expect(() =>
      makeEntry({ date: '2026-10-08', food: ' ', allergen: null, isNew: true, reaction: 'none' }),
    ).toThrow();
    expect(() =>
      makeEntry({
        date: '2026-02-30',
        food: 'Pear',
        allergen: null,
        isNew: true,
        reaction: 'none',
      }),
    ).toThrow();
  });
});

describe('solids plan content', () => {
  it('has consecutive weeks starting at 1', () => {
    expect(planWeeks.map((w) => w.week)).toEqual(planWeeks.map((_, i) => i + 1));
  });

  it('starts with smooth purees and only gets more textured', () => {
    const order = ['smooth', 'thicker', 'lumpy', 'chopped', 'family'];
    expect(planWeeks[0].stage).toBe('smooth');
    for (let i = 1; i < planWeeks.length; i++) {
      expect(order.indexOf(planWeeks[i].stage)).toBeGreaterThanOrEqual(
        order.indexOf(planWeeks[i - 1].stage),
      );
    }
  });

  it('introduces each major allergen once, after the first foods', () => {
    const introduced = planWeeks.filter((w) => w.allergen).map((w) => w.allergen!.id);
    expect(new Set(introduced)).toEqual(new Set(allergens));
    expect(introduced).toHaveLength(allergens.length);
    expect(planWeeks[0].allergen).toBeNull();
    expect(planWeeks[1].allergen).toBeNull();
  });

  it("never suggests honey, whole nuts or cow's milk to drink in the plan", () => {
    const text = planWeeks
      .flatMap((w) => w.tryFoods)
      .join(' | ')
      .toLowerCase();
    expect(text).not.toMatch(/honey|whole nuts?\b/);
    expect(text).not.toContain('glass of milk');
  });

  it('marks drafts visibly', () => {
    for (const w of planWeeks.filter((x) => x.reviewStatus === 'placeholder')) {
      expect(w.focus[0].startsWith('[PLACEHOLDER - needs expert review]')).toBe(true);
    }
  });

  it('has a quick-pick food for every major allergen', () => {
    const covered = new Set(quickFoods.map((f) => f.allergen).filter(Boolean));
    expect(covered).toEqual(new Set(allergens));
  });

  it('links every source id to a real page', () => {
    const ids = [
      ...planWeeks.flatMap((w) => w.sources),
      ...readiness.sources,
      ...chokingGuide.groups.flatMap((g) => g.sources),
      ...reactionAdvice.concerning.sources,
      ...reactionAdvice.mild.sources,
    ];
    for (const id of ids) expect(getSolidsSource(id)).toBeDefined();
  });
});

describe('reaction advice', () => {
  it('escalates a worrying reaction to 911 and a mild one to the pediatrician', () => {
    expect(JSON.stringify(reactionAdvice.concerning)).toContain('911');
    expect(reactionAdvice.mild.title.toLowerCase()).toContain('pediatrician');
  });

  it('is marked as a draft until reviewed', () => {
    for (const advice of [reactionAdvice.concerning, reactionAdvice.mild]) {
      if (advice.reviewStatus === 'placeholder') {
        expect(advice.intro.startsWith(PLACEHOLDER_MARKER)).toBe(true);
      }
    }
  });
});
