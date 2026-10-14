import { z } from 'zod';

import { allergens, diets } from '@/domain/profile';

import babyRecipesJson from './baby-recipes.json';
import recipesJson from './recipes.json';
import { reviewStatusSchema } from './schemas';

export const recipeTags = [
  'five-minute',
  'one-handed',
  'batch-cook',
  'freezer-friendly',
  'no-cook',
] as const;
export type RecipeTag = (typeof recipeTags)[number];

export const energyLevels = ['low', 'medium', 'high'] as const;
export type EnergyLevel = (typeof energyLevels)[number];

const tone = z.enum(['surface', 'muted', 'accent', 'sky', 'deep']);

export const recipeCategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** SF Symbol name (iOS). */
  icon: z.string().min(1),
  /** Stand-in where SF Symbols aren't available. */
  emoji: z.string().min(1),
  tone,
  description: z.string().min(1),
  /** Baby collections only: the age group starts at this many months. */
  fromMonths: z.number().int().nonnegative().optional(),
});
export type RecipeCategory = z.infer<typeof recipeCategorySchema>;

export const recipeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  icon: z.string().min(1),
  emoji: z.string().min(1),
  tone,
  /** Hands-on time. */
  activeMinutes: z.number().int().positive(),
  /** Including baking, chilling or slow cooking. */
  totalMinutes: z.number().int().positive(),
  servings: z.number().int().positive(),
  categories: z.array(z.string().min(1)).min(1),
  /** Baby recipes only: suitable from this age in months. Absent for grown-up recipes. */
  fromMonths: z.number().int().nonnegative().optional(),
  /** Baby recipes only: a grown-up recipe to cook alongside, and how to share the work. */
  familyMeal: z.object({ recipeId: z.string().min(1), note: z.string().min(1) }).optional(),
  tags: z.array(z.enum(recipeTags)),
  /** How much energy it takes to make. */
  energy: z.enum(energyLevels),
  /** Major allergens the recipe contains (US top 9). */
  allergens: z.array(z.enum(allergens)),
  /** Diets the recipe suits as written. */
  diets: z.array(z.enum(diets)),
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(z.string().min(1)).min(1),
  tips: z.array(z.string().min(1)),
  reviewStatus: reviewStatusSchema,
  reviewer: z.string().min(1),
});
export type Recipe = z.infer<typeof recipeSchema>;

const fileSchema = z.object({
  version: z.number(),
  categories: z.array(recipeCategorySchema).min(1),
  recipes: z.array(recipeSchema).min(1),
});

const file = fileSchema.parse(recipesJson);
const babyFile = fileSchema.parse(babyRecipesJson);

/** Grown-up recipes (Mom tab). */
export const recipeCategories: RecipeCategory[] = file.categories;
export const recipes: Recipe[] = file.recipes;

/** Baby and toddler recipes by age group (Baby tab). */
export const babyRecipeCategories: RecipeCategory[] = babyFile.categories;
export const babyRecipes: Recipe[] = babyFile.recipes;

export const allRecipes: Recipe[] = [...recipes, ...babyRecipes];
const allCategories: RecipeCategory[] = [...recipeCategories, ...babyRecipeCategories];

export function getRecipe(id: string): Recipe | undefined {
  return allRecipes.find((r) => r.id === id);
}

export function getCategory(id: string): RecipeCategory | undefined {
  return allCategories.find((c) => c.id === id);
}
