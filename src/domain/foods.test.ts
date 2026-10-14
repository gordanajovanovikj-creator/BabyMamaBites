import { foods, type Food } from '@/content/foods';
import { getSolidsSource } from '@/content/solids-plan';
import { PLACEHOLDER_MARKER } from '@/content/schemas';

import type { FoodLogEntry } from './food-log';
import { babyRecipes } from '@/content/recipes';

import {
  filterFoods,
  foodHadReaction,
  foodProgress,
  foodsForHousehold,
  foodTriedOn,
  recipesWithFood,
} from './foods';

const entry = (food: string, date: string, over: Partial<FoodLogEntry> = {}): FoodLogEntry => ({
  id: `${food}-${date}`,
  date,
  food,
  allergen: null,
  isNew: true,
  reaction: 'none',
  notes: null,
  ...over,
});

describe('filterFoods', () => {
  it('filters by category and name, A to Z', () => {
    const fruit = filterFoods(foods, '', 'fruits');
    expect(fruit.every((f) => f.category === 'fruits')).toBe(true);
    expect(fruit.map((f) => f.name)).toEqual([...fruit.map((f) => f.name)].sort());
    expect(filterFoods(foods, 'BROC', null).map((f) => f.id)).toEqual(['broccoli']);
    expect(filterFoods(foods, 'broc', 'fruits')).toEqual([]);
  });
});

describe('foodTriedOn', () => {
  const peas = { name: 'Peas' } as Pick<Food, 'name'>;
  it('matches whole words, singular or plural, and returns the latest date', () => {
    const log = [entry('Pea puree', '2026-01-02'), entry('peas and mint', '2026-01-05')];
    expect(foodTriedOn(log, peas)).toBe('2026-01-05');
    expect(foodTriedOn([entry('Peach slices', '2026-01-02')], peas)).toBeNull();
    expect(foodTriedOn([entry('Mashed strawberry', '2026-01-02')], { name: 'Strawberries' })).toBe(
      '2026-01-02',
    );
  });
  it('flags a logged reaction', () => {
    expect(
      foodHadReaction([entry('Egg', '2026-01-02', { reaction: 'mild' })], { name: 'Egg' }),
    ).toBe(true);
    expect(foodHadReaction([entry('Egg', '2026-01-02')], { name: 'Egg' })).toBe(false);
  });
});

describe('recipesWithFood', () => {
  const find = (id: string) => foods.find((f) => f.id === id)!;
  it('finds baby recipes by name, plural or other words, youngest first', () => {
    const eggs = recipesWithFood(babyRecipes, find('egg'));
    expect(eggs.length).toBeGreaterThan(0);
    expect(eggs.map((r) => r.fromMonths ?? 0)).toEqual(
      [...eggs.map((r) => r.fromMonths ?? 0)].sort((a, b) => a - b),
    );
    expect(recipesWithFood(babyRecipes, find('infant-cereal')).length).toBeGreaterThan(0);
    expect(recipesWithFood(babyRecipes, find('cheese')).length).toBeGreaterThan(0);
  });
  it("doesn't match inside other words", () => {
    const peas = recipesWithFood(babyRecipes, find('peas'));
    expect(peas.every((r) => /\bpeas?\b/i.test([r.title, ...r.ingredients].join(' ')))).toBe(true);
  });
});

describe('foodsForHousehold', () => {
  it('leaves out foods with an allergen the household avoids', () => {
    const safe = foodsForHousehold(foods, ['egg', 'fish']);
    expect(safe.some((f) => f.allergen === 'egg' || f.allergen === 'fish')).toBe(false);
    expect(safe.some((f) => f.id === 'banana')).toBe(true);
    expect(foodsForHousehold(foods, [])).toHaveLength(foods.length);
  });
});

describe('food guide content', () => {
  const text = (f: Food) =>
    [f.intro, f.choking, f.allergenNote ?? '', ...f.tips, ...f.serving.map((s) => s.text)].join(
      ' ',
    );

  it('has unique ids and is marked for expert review', () => {
    expect(new Set(foods.map((f) => f.id)).size).toBe(foods.length);
    for (const f of foods) {
      expect({
        id: f.id,
        ok: f.reviewStatus === 'placeholder' && f.intro.startsWith(PLACEHOLDER_MARKER),
      }).toEqual({ id: f.id, ok: true });
    }
  });
  it('cites known sources', () => {
    const missing = foods.flatMap((f) => f.sources.filter((s) => !getSolidsSource(s)));
    expect(missing).toEqual([]);
  });
  it('explains every common allergen, and only those', () => {
    for (const f of foods) {
      expect({ id: f.id, note: f.allergenNote !== null }).toEqual({
        id: f.id,
        note: f.allergen !== null,
      });
    }
  });
  it('never claims foods change milk supply or uses honey', () => {
    const banned = /milk supply|lactation|galactagogue|boost|\bhoney\b/i;
    expect(foods.filter((f) => banned.test(text(f))).map((f) => f.id)).toEqual([]);
  });
});

describe('foodProgress', () => {
  const byName = (n: string) => foods.find((f) => f.name === n)!;
  const names = foods.map((f) => f.name);

  it('counts tried foods overall and per category', () => {
    const p = foodProgress([entry(names[0], '2026-10-01'), entry(names[0], '2026-10-02')], foods);
    expect(p.tried).toBe(1);
    expect(p.total).toBe(foods.length);
    const cat = p.byCategory.find((c) => c.category === byName(names[0]).category)!;
    expect(cat.tried).toBe(1);
    expect(p.byCategory.reduce((n, c) => n + c.total, 0)).toBe(foods.length);
  });

  it('tracks the last milestone and the distance to the next', () => {
    expect(foodProgress([], foods)).toMatchObject({ tried: 0, milestone: null, toNext: 1 });
    const six = names.slice(0, 6).map((n) => entry(n, '2026-10-01'));
    expect(foodProgress(six, foods)).toMatchObject({ tried: 6, milestone: 5, toNext: 4 });
  });

  it('celebrates trying every food', () => {
    const all = names.map((n) => entry(n, '2026-10-01'));
    expect(foodProgress(all, foods)).toMatchObject({
      tried: foods.length,
      milestone: foods.length,
      toNext: null,
    });
  });
});
