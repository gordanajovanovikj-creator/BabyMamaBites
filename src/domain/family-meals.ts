import type { Recipe } from '@/content/recipes';

import type { MealSlot } from './planner';
import { suitsHousehold, type Household } from './recipes';

/**
 * Main ingredients we match baby and family recipes on, most specific first. Each match
 * is cut out of the text before the next is tried, so "sweet potato" is never also
 * "potato" and "peanut butter" is never also "peanut".
 */
const keyIngredients: { label: string; pattern: RegExp }[] = [
  { label: 'sweet potato', pattern: /sweet potato(e?s)?/g },
  { label: 'peanut butter', pattern: /peanut butter/g },
  { label: 'almond butter', pattern: /almond butter/g },
  { label: 'butternut squash', pattern: /butternut( squash)?|pumpkin/g },
  { label: 'green beans', pattern: /green beans?|haricots? verts?/g },
  { label: 'black beans', pattern: /black beans?/g },
  { label: 'white beans', pattern: /cannellini( beans?)?|white beans?|navy beans?/g },
  { label: 'chickpeas', pattern: /chickpeas?|garbanzo/g },
  { label: 'lentils', pattern: /lentils?/g },
  { label: 'potato', pattern: /potato(e?s)?/g },
  { label: 'carrot', pattern: /carrots?/g },
  { label: 'broccoli', pattern: /broccoli/g },
  { label: 'peas', pattern: /\bpeas\b/g },
  { label: 'spinach', pattern: /spinach/g },
  { label: 'zucchini', pattern: /zucchini/g },
  { label: 'cauliflower', pattern: /cauliflower/g },
  { label: 'kale', pattern: /\bkale\b/g },
  { label: 'parsnip', pattern: /parsnips?/g },
  { label: 'tomato', pattern: /tomato(e?s)?/g },
  { label: 'avocado', pattern: /avocados?/g },
  { label: 'banana', pattern: /bananas?/g },
  { label: 'apple', pattern: /\bapples?\b/g },
  { label: 'pear', pattern: /\bpears?\b/g },
  { label: 'berries', pattern: /\w*berr(y|ies)/g },
  { label: 'mango', pattern: /mangos?(es)?/g },
  { label: 'peach', pattern: /peach(es)?/g },
  { label: 'egg', pattern: /\beggs?\b/g },
  { label: 'chicken', pattern: /chicken/g },
  { label: 'beef', pattern: /\bbeef\b/g },
  { label: 'turkey', pattern: /turkey/g },
  { label: 'salmon', pattern: /salmon/g },
  { label: 'white fish', pattern: /\bcod\b|white fish|tilapia/g },
  { label: 'shrimp', pattern: /shrimp/g },
  { label: 'tofu', pattern: /\btofu\b/g },
  { label: 'oats', pattern: /\boats?\b|oatmeal|oat cereal/g },
  { label: 'quinoa', pattern: /quinoa/g },
  { label: 'rice', pattern: /\brice\b/g },
  { label: 'pasta', pattern: /pasta|noodles?|spaghetti|macaroni|penne|orzo/g },
  { label: 'bread', pattern: /bread|\btoast\b|tortillas?|\bpitas?\b/g },
  { label: 'yogurt', pattern: /yogurt/g },
  { label: 'cheese', pattern: /cheese|cheddar|ricotta|mozzarella|parmesan/g },
  { label: 'coconut', pattern: /coconut/g },
];

// Liquids and seasonings that name a food without being it ("chicken broth").
const noise =
  /(chicken|beef|vegetable|bone) (broth|stock)|(oat|almond|soy|rice) milk|breast milk|formula|pumpkin (pie )?spice/g;

/** The main ingredients of a recipe, such as "sweet potato" or "oats", in list order. */
export function mainIngredients(recipe: Pick<Recipe, 'ingredients'>): string[] {
  let text = recipe.ingredients.join('\n').toLowerCase().replace(noise, ' ');
  const found: string[] = [];
  for (const { label, pattern } of keyIngredients) {
    if (text.match(pattern)) {
      found.push(label);
      text = text.replace(pattern, ' ');
    }
  }
  return found;
}

export type FamilyMealOption = { recipe: Recipe; shared: string[] };

/**
 * Grown-up recipes that share main ingredients with a baby recipe, so one shop and one
 * cook covers both: most shared ingredients first, then recipes meant for this meal of
 * the day. Only recipes that suit the household's allergies and diets.
 */
export function familyMealOptions(
  babyRecipe: Recipe,
  familyRecipes: Recipe[],
  household: Pick<Household, 'allergens' | 'diets'>,
  slot?: MealSlot,
): FamilyMealOption[] {
  const wanted = new Set(mainIngredients(babyRecipe));
  if (!wanted.size) return [];
  return familyRecipes
    .filter((r) => suitsHousehold(r, household))
    .map((recipe) => ({
      recipe,
      shared: mainIngredients(recipe).filter((i) => wanted.has(i)),
    }))
    .filter((o) => o.shared.length > 0)
    .sort((a, b) => {
      const forSlot = (o: FamilyMealOption) => (slot && o.recipe.categories.includes(slot) ? 1 : 0);
      return (
        b.shared.length - a.shared.length ||
        forSlot(b) - forSlot(a) ||
        a.recipe.title.localeCompare(b.recipe.title)
      );
    });
}

/** Stored when the parent wants no family meal next to a baby meal. */
export const NO_FAMILY_MEAL = 'none';

/**
 * The family meal shown next to a planned baby recipe: the parent's own pick, nothing
 * if they removed it, or else the recipe's suggested pairing. Never a recipe that
 * doesn't suit the household.
 */
export function plannedFamilyMeal(
  babyRecipe: Recipe,
  choice: string | undefined,
  all: Recipe[],
  household: Pick<Household, 'allergens' | 'diets'>,
): { recipe: Recipe; note: string | null } | null {
  if (choice === NO_FAMILY_MEAL) return null;
  const pairing = babyRecipe.familyMeal;
  const id = choice ?? pairing?.recipeId;
  const recipe = id ? all.find((r) => r.id === id) : undefined;
  if (!recipe || !suitsHousehold(recipe, household)) return null;
  return { recipe, note: pairing?.recipeId === recipe.id ? pairing.note : null };
}
