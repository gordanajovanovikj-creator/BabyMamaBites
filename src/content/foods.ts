import { z } from 'zod';

import { allergens } from '@/domain/profile';

import data from './foods.json';

export const foodCategories = ['vegetables', 'fruits', 'proteins', 'grains', 'dairy'] as const;
export type FoodCategory = (typeof foodCategories)[number];

export const foodCategoryLabels: Record<FoodCategory, string> = {
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  proteins: 'Proteins',
  grains: 'Grains',
  dairy: 'Dairy',
};

export const chokingRisks = ['low', 'medium', 'high'] as const;
export type ChokingRisk = (typeof chokingRisks)[number];

const foodSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Other words for this food in recipes and the food log, e.g. "cheddar" for cheese. */
  alsoMatches: z.array(z.string().min(1)).optional(),
  category: z.enum(foodCategories),
  fromMonths: z.number().int().min(6),
  allergen: z.enum(allergens).nullable(),
  ironRich: z.boolean(),
  emoji: z.string().min(1),
  intro: z.string().min(1),
  serving: z.array(z.object({ age: z.string().min(1), text: z.string().min(1) })).min(1),
  chokingRisk: z.enum(chokingRisks),
  choking: z.string().min(1),
  allergenNote: z.string().min(1).nullable(),
  tips: z.array(z.string().min(1)),
  sources: z.array(z.string().min(1)).min(1),
  reviewer: z.string().min(1),
});
export type Food = z.infer<typeof foodSchema>;

const fileSchema = z.object({
  version: z.number(),
  region: z.literal('US'),
  foods: z.array(foodSchema).min(1),
});

export const foods: Food[] = fileSchema.parse(data).foods;

export function getFood(id: string): Food | undefined {
  return foods.find((f) => f.id === id);
}
