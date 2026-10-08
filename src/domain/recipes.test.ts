import { recipeCategories, recipes as bundled, type Recipe } from '@/content/recipes';

import { allergens } from './profile';
import {
  findRecipes,
  fitsCookingTime,
  formatMinutes,
  matchesFilters,
  suitsHousehold,
} from './recipes';

function make(id: string, extra: Partial<Recipe> = {}): Recipe {
  return {
    id,
    title: id,
    summary: '[PLACEHOLDER - needs expert review] test',
    icon: 'fork.knife',
    emoji: '🍽️',
    tone: 'surface',
    activeMinutes: 10,
    totalMinutes: 10,
    servings: 1,
    categories: ['dinner'],
    tags: [],
    energy: 'low',
    allergens: [],
    diets: [],
    ingredients: ['x'],
    steps: ['y'],
    tips: [],
    reviewStatus: 'placeholder',
    reviewer: 'test',
    ...extra,
  };
}

const household = { allergens: [], diets: [], cookingTime: 'flexible' as const };

describe('suitsHousehold', () => {
  it('hides recipes containing a household allergen', () => {
    const r = make('pb', { allergens: ['peanut', 'milk'] });
    expect(suitsHousehold(r, { allergens: ['peanut'], diets: [] })).toBe(false);
    expect(suitsHousehold(r, { allergens: ['egg'], diets: [] })).toBe(true);
  });

  it('requires every diet the household follows', () => {
    const r = make('v', { diets: ['vegetarian', 'halal'] });
    expect(suitsHousehold(r, { allergens: [], diets: ['vegetarian'] })).toBe(true);
    expect(suitsHousehold(r, { allergens: [], diets: ['vegetarian', 'vegan'] })).toBe(false);
  });
});

describe('fitsCookingTime', () => {
  it('matches hands-on time to the time the user has', () => {
    expect(fitsCookingTime(make('a', { activeMinutes: 5 }), 'minimal')).toBe(true);
    expect(fitsCookingTime(make('a', { activeMinutes: 10 }), 'minimal')).toBe(false);
    expect(fitsCookingTime(make('a', { activeMinutes: 15 }), 'short')).toBe(true);
    expect(fitsCookingTime(make('a', { activeMinutes: 40 }), 'relaxed')).toBe(true);
    expect(fitsCookingTime(make('a', { activeMinutes: 40 }), 'flexible')).toBe(true);
  });
});

describe('matchesFilters', () => {
  it('filters by category, all selected tags, and energy', () => {
    const r = make('r', {
      categories: ['lunch'],
      tags: ['five-minute', 'no-cook'],
      energy: 'medium',
    });
    expect(matchesFilters(r, { categoryId: 'lunch' })).toBe(true);
    expect(matchesFilters(r, { categoryId: 'dinner' })).toBe(false);
    expect(matchesFilters(r, { tags: ['five-minute', 'no-cook'] })).toBe(true);
    expect(matchesFilters(r, { tags: ['five-minute', 'one-handed'] })).toBe(false);
    expect(matchesFilters(r, { maxEnergy: 'low' })).toBe(false);
    expect(matchesFilters(r, { maxEnergy: 'medium' })).toBe(true);
  });
});

describe('findRecipes', () => {
  const all = [
    make('slow', { activeMinutes: 30 }),
    make('quick', { activeMinutes: 5 }),
    make('peanut', { activeMinutes: 5, allergens: ['peanut'] }),
  ];

  it('never returns unsafe recipes and counts what it hid', () => {
    const res = findRecipes(all, { ...household, allergens: ['peanut'] });
    expect(res.recipes.map((r) => r.id)).not.toContain('peanut');
    expect(res.hiddenForSafety).toBe(1);
  });

  it('puts recipes that fit the cooking time first', () => {
    const res = findRecipes(all, { ...household, cookingTime: 'minimal' });
    expect(res.recipes[0].activeMinutes).toBeLessThanOrEqual(5);
    expect(res.recipes.at(-1)?.id).toBe('slow');
  });
});

describe('formatMinutes', () => {
  it.each([
    [5, '5 min'],
    [60, '1 hr'],
    [250, '4 hr 10 min'],
  ])('%i → %s', (m, s) => expect(formatMinutes(m)).toBe(s));
});

// ---------- Content checks ----------

/** Words that signal an allergen in an ingredient line. Deliberately cautious. */
const allergenSignals: Record<(typeof allergens)[number], RegExp> = {
  milk: /\b(milk|yogurt|cheese|parmesan|(?<!(peanut|nut|seed|almond) )butter|cream|whey|chocolate)\b/i,
  egg: /\beggs?\b/i,
  peanut: /\bpeanut/i,
  'tree-nuts': /\b(almond|cashew|walnut|pecan|pistachio|hazelnut|macadamia)/i,
  sesame: /\b(sesame|tahini|hummus)\b/i,
  soy: /\b(soy|tofu|edamame|tamari|miso)\b/i,
  wheat: /\b(flour|bread|tortillas?|pasta|crackers|wheat|soy sauce|couscous)\b/i,
  fish: /\b(salmon|tuna|cod|tilapia|sardines?|trout|fish)\b/i,
  shellfish: /\b(shrimp|crab|lobster|scallops?|clams?|mussels?)\b/i,
};
/** Ingredient phrases that look like an allergen but aren't. */
const notAllergen = /\b(coconut milk|peanut-free|dairy-free|oat milk|plant milk)\b/i;

describe('bundled recipes', () => {
  it('declare every allergen their ingredients suggest', () => {
    for (const r of bundled) {
      for (const [allergen, signal] of Object.entries(allergenSignals)) {
        const mentioned = r.ingredients.some((i) => signal.test(i) && !notAllergen.test(i));
        if (mentioned)
          expect({ recipe: r.id, allergens: r.allergens }).toEqual({
            recipe: r.id,
            allergens: expect.arrayContaining([allergen]),
          });
      }
    }
  });

  it('keep diet tags consistent', () => {
    for (const r of bundled) {
      if (r.diets.includes('vegan')) {
        expect(r.diets).toEqual(expect.arrayContaining(['vegetarian']));
        expect(r.allergens.filter((a) => ['milk', 'egg', 'fish', 'shellfish'].includes(a))).toEqual(
          [],
        );
      }
      if (r.diets.includes('vegetarian')) expect(r.diets).toContain('pescatarian');
      if (r.diets.includes('gluten-free')) expect(r.allergens).not.toContain('wheat');
    }
  });

  it('only use known categories, and every category has recipes', () => {
    const ids = new Set(recipeCategories.map((c) => c.id));
    for (const r of bundled) for (const c of r.categories) expect(ids.has(c)).toBe(true);
    for (const c of recipeCategories) {
      expect(bundled.some((r) => r.categories.includes(c.id))).toBe(true);
    }
  });

  it('are marked for review and have unique ids', () => {
    expect(new Set(bundled.map((r) => r.id)).size).toBe(bundled.length);
    for (const r of bundled.filter((x) => x.reviewStatus === 'placeholder')) {
      expect(r.summary.startsWith('[PLACEHOLDER - needs expert review]')).toBe(true);
    }
  });

  it('match the 5-minute tag to the hands-on time', () => {
    for (const r of bundled) {
      if (r.tags.includes('five-minute')) expect(r.activeMinutes).toBeLessThanOrEqual(5);
    }
  });

  it('never claim a food increases milk supply', () => {
    const text = JSON.stringify(bundled).toLowerCase();
    for (const banned of [
      'milk supply',
      'boost milk',
      'increase milk',
      'lactation',
      'galactagogue',
    ]) {
      expect(text).not.toContain(banned);
    }
  });

  it('use SF Symbol names that exist', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { readFileSync } = require('fs') as typeof import('fs');
    const symbols = readFileSync(require.resolve('sf-symbols-typescript/dist/index.d.ts'), 'utf8');
    for (const x of [...bundled, ...recipeCategories]) expect(symbols).toContain(`'${x.icon}'`);
  });
});
