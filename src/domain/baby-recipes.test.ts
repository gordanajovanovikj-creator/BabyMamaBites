import {
  babyRecipeCategories,
  babyRecipes,
  getRecipe,
  recipeCategories,
  recipes,
} from '@/content/recipes';
import { PLACEHOLDER_MARKER } from '@/content/schemas';

import { babyCollectionsFor, familyMealFor, isAheadOfAge, recipeKicker } from './recipes';

describe('babyCollectionsFor', () => {
  it('puts the current age group first, then the rest by age', () => {
    const { ordered, current } = babyCollectionsFor(babyRecipeCategories, 9);
    expect(current).toBe('baby-9m');
    expect(ordered.map((c) => c.id)).toEqual(['baby-9m', 'baby-6m', 'baby-7m', 'baby-12m']);
  });

  it('has no current group before 6 months', () => {
    const { ordered, current } = babyCollectionsFor(babyRecipeCategories, 4);
    expect(current).toBeNull();
    expect(ordered[0].id).toBe('baby-6m');
  });

  it('uses the toddler group from 12 months on', () => {
    expect(babyCollectionsFor(babyRecipeCategories, 20).current).toBe('baby-12m');
  });
});

describe('baby recipes', () => {
  const text = (r: (typeof babyRecipes)[number]) =>
    [r.title, ...r.ingredients, ...r.steps].join(' ').toLowerCase();

  it('have unique ids across all recipes, and resolve by id', () => {
    const ids = [...recipes, ...babyRecipes].map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of babyRecipes) expect(getRecipe(r.id)).toBe(r);
  });

  it('each belong to one age group that matches their starting age', () => {
    for (const r of babyRecipes) {
      expect(r.categories).toHaveLength(1);
      const group = babyRecipeCategories.find((c) => c.id === r.categories[0]);
      expect(group?.fromMonths).toBe(r.fromMonths);
    }
    expect(recipes.every((r) => r.fromMonths === undefined)).toBe(true);
    expect(recipeCategories.every((c) => c.fromMonths === undefined)).toBe(true);
  });

  it('start at 6 months or later', () => {
    for (const r of babyRecipes) expect(r.fromMonths).toBeGreaterThanOrEqual(6);
  });

  it('never use honey, added sugar or added salt', () => {
    for (const r of babyRecipes) {
      const t = text(r);
      expect(t).not.toMatch(/\bhoney\b|\bsugar\b|\bsyrup\b/);
      expect(t).not.toMatch(/\b(pinch of|tsp|tbsp) salt\b/);
    }
  });

  it('only offer cow milk to drink, or as an ingredient, from 12 months', () => {
    for (const r of babyRecipes.filter((x) => /whole milk(?! yogurt)/i.test(text(x)))) {
      expect(r.fromMonths).toBeGreaterThanOrEqual(12);
    }
  });

  it('tag the allergens their ingredients contain', () => {
    const signals: [string, RegExp][] = [
      ['egg', /\beggs?\b/],
      ['peanut', /peanut/],
      ['milk', /yogurt|cheese|cheddar|whole milk/],
      ['wheat', /pasta|tortilla|breadcrumbs/],
      ['fish', /salmon|cod|fish/],
    ];
    for (const r of babyRecipes) {
      const t = r.ingredients.join(' ').toLowerCase();
      for (const [allergen, pattern] of signals) {
        if (pattern.test(t))
          expect({ id: r.id, has: r.allergens }).toEqual({
            id: r.id,
            has: expect.arrayContaining([allergen]),
          });
      }
    }
  });

  it('are marked as drafts until reviewed', () => {
    for (const r of babyRecipes.filter((x) => x.reviewStatus === 'placeholder')) {
      expect(r.summary.startsWith(PLACEHOLDER_MARKER)).toBe(true);
    }
  });

  it('show their starting age as the kicker', () => {
    expect(recipeKicker(babyRecipes[0])).toBe(`From ${babyRecipes[0].fromMonths} months`);
  });
});

describe('family meals', () => {
  it('pairs every baby recipe with a grown-up recipe', () => {
    for (const r of babyRecipes) {
      expect(r.familyMeal).toBeDefined();
      expect(recipes.some((g) => g.id === r.familyMeal?.recipeId)).toBe(true);
    }
  });

  it("hides the family meal when it doesn't suit the household", () => {
    const lentils = babyRecipes.find((r) => r.id === 'baby-lentil-carrot-mash')!;
    const all = [...recipes, ...babyRecipes];
    expect(familyMealFor(lentils, all, { allergens: [], diets: [] })?.recipe.id).toBe(
      'lentil-soup',
    );
    const avocado = babyRecipes.find((r) => r.id === 'baby-avocado-banana-mash')!;
    expect(familyMealFor(avocado, all, { allergens: ['egg'], diets: [] })).toBeNull();
  });
});

describe('isAheadOfAge', () => {
  it('flags baby recipes meant for older babies only', () => {
    const nineMonth = babyRecipes.find((r) => r.fromMonths === 9)!;
    expect(isAheadOfAge(nineMonth, 7)).toBe(true);
    expect(isAheadOfAge(nineMonth, 9)).toBe(false);
    expect(isAheadOfAge(recipes[0], 2)).toBe(false);
  });
});
