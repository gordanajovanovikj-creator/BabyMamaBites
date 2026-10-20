import { z } from 'zod';

import type { Recipe } from '@/content/recipes';

import type { IsoDate } from './dates';
import { plannedFamilyMeal } from './family-meals';
import { mealSlots, planKey, type FamilyPlan, type MealPlan } from './planner';
import type { Household } from './recipes';

/** Store sections a list is grouped by, in walking order. Stored values: append, never rename. */
export const shoppingAisles = [
  'produce',
  'bakery',
  'meat',
  'dairy',
  'frozen',
  'pantry',
  'baby',
  'other',
] as const;
export type ShoppingAisle = (typeof shoppingAisles)[number];

export const shoppingAisleLabels: Record<ShoppingAisle, string> = {
  produce: 'Produce',
  bakery: 'Bakery',
  meat: 'Meat & fish',
  dairy: 'Dairy & eggs',
  frozen: 'Frozen',
  pantry: 'Pantry',
  baby: 'Baby',
  other: 'Other',
};

export const SHOPPING_ITEM_MAX_LENGTH = 200;

export const shoppingItemSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1).max(SHOPPING_ITEM_MAX_LENGTH),
  checked: z.boolean(),
  aisle: z.enum(shoppingAisles),
  /** The recipe it came from, shown under the item; null for items typed in. */
  recipeTitle: z.string().max(120).nullable(),
  /** ISO timestamp; items keep the order they were added in. */
  addedAt: z.string().min(1),
});
export type ShoppingItem = z.infer<typeof shoppingItemSchema>;

/** One ingredient line on its way to the list. */
export type ShoppingLine = { text: string; recipeTitle: string | null };

/**
 * Keyword rules, checked in order: the first match wins. More specific phrases come
 * first, so "peanut butter" is pantry (not dairy) and "frozen peas" is frozen (not produce).
 */
const aisleRules: { aisle: ShoppingAisle; pattern: RegExp }[] = [
  { aisle: 'baby', pattern: /infant (cereal|oatmeal)|diapers?|\bwipes\b|\bformula\b|breast milk|baby food/ },
  { aisle: 'frozen', pattern: /\bfrozen\b|\bice\b/ },
  {
    aisle: 'pantry',
    pattern:
      /\bcans?\b|canned|\bjar\b|(peanut|almond|nut|seed|sunflower) butter|coconut (milk|water)|broth|stock|\bdried\b|pumpkin pur[eé]e/,
  },
  {
    aisle: 'meat',
    pattern:
      /chicken|\bbeef\b|turkey|\bpork\b|\blamb\b|salmon|\btuna\b|\bcod\b|\bfish\b|shrimp|sausage|bacon|\bham\b|meatballs?/,
  },
  {
    aisle: 'dairy',
    pattern:
      /\bmilk\b|yogh?urt|cheese|cheddar|mozzarella|parmesan|ricotta|\bfeta\b|butter|\bcream\b|kefir|\beggs?\b/,
  },
  {
    aisle: 'bakery',
    pattern: /\bbread\b|tortillas?|\bbuns?\b|bagels?|\bpitas?\b|\bnaan\b|\brolls?\b|english muffins?|flatbreads?|pizza crusts?|breadcrumbs/,
  },
  {
    aisle: 'produce',
    pattern:
      /apples?|bananas?|berr(y|ies)|\bpears?\b|peach(es)?|mangos?|avocados?|lemons?|\blimes?\b|oranges?|grapes?|melon|kiwi|spinach|\bkale\b|lettuce|broccoli|carrots?|zucchini|squash|potato(e?s)?|onions?|garlic|ginger|tomato(e?s)?|cucumbers?|bell peppers?|(red|green|yellow) peppers?|celery|\bpeas\b|\bcorn\b|mushrooms?|cauliflower|parsley|cilantro|basil|\bdill\b|\bmint\b|green beans?|beets?|cabbage|asparagus|scallions?|\bherbs?\b|vegetables|pitted|medjool|pomegranate|arugula|thyme|rosemary|parsnips?|edamame|tofu|fresh turmeric|plums?|cherr(y|ies)|pineapple|watermelon|figs?/,
  },
  {
    aisle: 'pantry',
    pattern:
      /\boats?\b|\brice\b|quinoa|pasta|noodles|couscous|flour|sugar|\boil\b|vinegar|\bsalt\b|pepper|cinnamon|cumin|paprika|spice|seasoning|honey|maple|beans?|chickpeas?|lentils?|sauce|salsa|seeds?|\bchia\b|\bnuts?\b|raisins?|vanilla|baking|cocoa|hummus|crackers?|cereal|powder|chocolate|cacao|matcha|juice|tahini|mustard|cornstarch|spaghetti|linguine|penne|fettuccine|rotini|rigatoni|yeast|barley|nutmeg|turmeric|vinaigrette|walnuts|pecans|olives/,
  },
];

/** The store section an ingredient line most likely belongs to. */
export function aisleFor(text: string): ShoppingAisle {
  // "Fresh or frozen berries" are shopped as fresh.
  const t = text.toLowerCase().replace(/fresh or frozen|frozen or fresh/g, 'fresh');
  return aisleRules.find((r) => r.pattern.test(t))?.aisle ?? 'other';
}

/** Lowercased, single-spaced text, for spotting the same item twice. */
export function normalizeItemText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Whether an ingredient starts ticked when adding a recipe: water, ice and breast milk
 * usually aren't bought, so they start unticked (the parent can still tick them).
 */
export function defaultPicked(text: string): boolean {
  const t = text.trim();
  if (/^(warm |cold )?(water|ice|breast milk)\b/i.test(t)) return false;
  // "3 cups water", but not "cornstarch mixed with cold water" or "coconut water".
  return !(aisleFor(t) === 'other' && /\bwater\b/i.test(t));
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Validates and tidies a new list item; throws if the text is blank or too long. */
export function makeShoppingItem(
  line: ShoppingLine,
  addedAt: Date = new Date(),
  id: string = newId(),
): ShoppingItem {
  const text = line.text.trim().replace(/\s+/g, ' ');
  return shoppingItemSchema.parse({
    id,
    text,
    checked: false,
    aisle: aisleFor(text),
    recipeTitle: line.recipeTitle,
    addedAt: addedAt.toISOString(),
  });
}

/** Whether the same item is already on the list and not yet checked off. */
export function isOnList(items: ShoppingItem[], text: string): boolean {
  const key = normalizeItemText(text);
  return items.some((i) => !i.checked && normalizeItemText(i.text) === key);
}

/**
 * New items for these lines, skipping blanks, repeats within the lines and anything
 * already on the list (unchecked). Added a millisecond apart so they keep their order.
 */
export function itemsToAdd(
  existing: ShoppingItem[],
  lines: ShoppingLine[],
  now: Date = new Date(),
): ShoppingItem[] {
  const seen = new Set(existing.filter((i) => !i.checked).map((i) => normalizeItemText(i.text)));
  const added: ShoppingItem[] = [];
  for (const line of lines) {
    const key = normalizeItemText(line.text);
    if (!key || key.length > SHOPPING_ITEM_MAX_LENGTH || seen.has(key)) continue;
    seen.add(key);
    added.push(makeShoppingItem(line, new Date(now.getTime() + added.length)));
  }
  return added;
}

/** Oldest first. */
export function sortShopping(items: ShoppingItem[]): ShoppingItem[] {
  return [...items].sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

/** Items still to buy, grouped by aisle in walking order (empty aisles left out). */
export function groupByAisle(
  items: ShoppingItem[],
): { aisle: ShoppingAisle; items: ShoppingItem[] }[] {
  const toBuy = sortShopping(items.filter((i) => !i.checked));
  return shoppingAisles
    .map((aisle) => ({ aisle, items: toBuy.filter((i) => i.aisle === aisle) }))
    .filter((g) => g.items.length > 0);
}

/** How many items are still to buy, out of the whole list. */
export function shoppingProgress(items: ShoppingItem[]): { left: number; total: number } {
  return { left: items.filter((i) => !i.checked).length, total: items.length };
}

/** The items still to buy as plain text, for sharing in a message or a notes app. */
export function listAsText(items: ShoppingItem[]): string {
  const groups = groupByAisle(items);
  if (!groups.length) return 'Shopping list\n\nAll done!';
  const body = groups
    .map((g) => [shoppingAisleLabels[g.aisle], ...g.items.map((i) => `• ${i.text}`)].join('\n'))
    .join('\n\n');
  return `Shopping list\n\n${body}`;
}

/**
 * The recipes planned on these dates, each once: the baby's recipes and the family
 * meals planned next to them (foods and typed-in meals have no ingredient list).
 */
export function plannedRecipes(
  plan: MealPlan,
  family: FamilyPlan,
  dates: IsoDate[],
  all: Recipe[],
  household: Pick<Household, 'allergens' | 'diets'>,
): Recipe[] {
  const found = new Map<string, Recipe>();
  for (const date of dates) {
    for (const slot of mealSlots) {
      const key = planKey(date, slot);
      const baby = all.find((r) => r.id === plan[key]);
      if (!baby) continue;
      if (!found.has(baby.id)) found.set(baby.id, baby);
      const familyMeal = plannedFamilyMeal(baby, family[key], all, household);
      if (familyMeal && !found.has(familyMeal.recipe.id)) {
        found.set(familyMeal.recipe.id, familyMeal.recipe);
      }
    }
  }
  return [...found.values()];
}

/** One ingredient offered when adding a recipe, and whether it starts ticked. */
export type IngredientPick = ShoppingLine & { key: string; onList: boolean; picked: boolean };

/**
 * Each recipe's ingredients to choose from, each line once across all the recipes.
 * Lines start ticked unless they're already on the list or are water and the like.
 */
export function ingredientPicks(
  recipes: Pick<Recipe, 'id' | 'title' | 'ingredients'>[],
  items: ShoppingItem[],
): { recipeId: string; title: string; lines: IngredientPick[] }[] {
  const seen = new Set<string>();
  return recipes
    .map((recipe) => ({
      recipeId: recipe.id,
      title: recipe.title,
      lines: recipe.ingredients.flatMap((text): IngredientPick[] => {
        const key = normalizeItemText(text);
        if (!key || seen.has(key)) return [];
        seen.add(key);
        const onList = isOnList(items, text);
        return [
          { key, text, recipeTitle: recipe.title, onList, picked: !onList && defaultPicked(text) },
        ];
      }),
    }))
    .filter((g) => g.lines.length > 0);
}
