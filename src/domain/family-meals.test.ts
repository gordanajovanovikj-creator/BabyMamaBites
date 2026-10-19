import { babyRecipes, getRecipe, recipes, type Recipe } from '@/content/recipes';

import {
  familyMealOptions,
  mainIngredients,
  NO_FAMILY_MEAL,
  plannedFamilyMeal,
} from './family-meals';
import { suitsHousehold } from './recipes';

const anyone = { allergens: [], diets: [] };

function baby(id: string): Recipe {
  const r = getRecipe(id);
  if (!r) throw new Error(`missing ${id}`);
  return r;
}

describe('mainIngredients', () => {
  it('finds the main foods and never double-counts a longer name', () => {
    expect(
      mainIngredients({ ingredients: ['2 medium sweet potatoes', 'Breast milk to thin'] }),
    ).toEqual(['sweet potato']);
    expect(mainIngredients({ ingredients: ['1 tbsp smooth peanut butter', '1 banana'] })).toEqual([
      'peanut butter',
      'banana',
    ]);
  });

  it('ignores broths, plant milks and formula', () => {
    expect(
      mainIngredients({
        ingredients: ['1 cup low-sodium chicken broth', '1/2 cup oat milk', 'Formula to mix'],
      }),
    ).toEqual([]);
  });
});

describe('familyMealOptions', () => {
  it('offers at least one family meal for every baby recipe', () => {
    for (const r of babyRecipes) {
      expect(familyMealOptions(r, recipes, anyone).length).toBeGreaterThan(0);
    }
  });

  it('only offers recipes that share an ingredient, most shared first', () => {
    const options = familyMealOptions(
      baby('baby-squash-chicken-risotto'),
      recipes,
      anyone,
      'dinner',
    );
    expect(options[0].shared.length).toBeGreaterThanOrEqual(
      options[options.length - 1].shared.length,
    );
    for (const o of options) expect(o.shared.length).toBeGreaterThan(0);
  });

  it('leaves out recipes that do not suit the household', () => {
    const household = { allergens: ['egg' as const, 'milk' as const], diets: [] };
    for (const o of familyMealOptions(baby('toddler-french-toast-sticks'), recipes, household)) {
      expect(suitsHousehold(o.recipe, household)).toBe(true);
    }
  });
});

describe('plannedFamilyMeal', () => {
  const cereal = baby('baby-oat-cereal');

  it('shows the suggested pairing, with its note, until the parent changes it', () => {
    const meal = plannedFamilyMeal(cereal, undefined, recipes, anyone);
    expect(meal?.recipe.id).toBe(cereal.familyMeal?.recipeId);
    expect(meal?.note).toBe(cereal.familyMeal?.note);
  });

  it("shows the parent's own pick without the pairing note", () => {
    const meal = plannedFamilyMeal(cereal, 'baked-oatmeal', recipes, anyone);
    expect(meal?.recipe.id).toBe('baked-oatmeal');
    expect(meal?.note).toBeNull();
  });

  it('shows nothing once removed', () => {
    expect(plannedFamilyMeal(cereal, NO_FAMILY_MEAL, recipes, anyone)).toBeNull();
  });
});
