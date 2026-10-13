import { getFood, type Food } from '@/content/foods';
import { getRecipe, type Recipe } from '@/content/recipes';
import { customMealName, foodMealFoodId } from '@/domain/planner';

export type PlannedMeal =
  | { kind: 'recipe'; recipe: Recipe; title: string }
  | { kind: 'food'; food: Food; title: string }
  | { kind: 'own'; title: string };

/** What a stored planner id points to: a recipe, a single food or a typed-in food. */
export function plannedMeal(id: string | undefined): PlannedMeal | null {
  if (!id) return null;
  const recipe = getRecipe(id);
  if (recipe) return { kind: 'recipe', recipe, title: recipe.title };
  const foodId = foodMealFoodId(id);
  const food = foodId ? getFood(foodId) : undefined;
  if (food) return { kind: 'food', food, title: food.name };
  const own = customMealName(id);
  return own ? { kind: 'own', title: own } : null;
}
