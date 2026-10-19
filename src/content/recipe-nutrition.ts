import { z } from 'zod';

import data from './recipe-nutrition.json';

/** Estimated nutrients for one serving. */
export const nutrientsSchema = z.object({
  kcal: z.number().nonnegative(),
  proteinG: z.number().nonnegative(),
  carbsG: z.number().nonnegative(),
  fiberG: z.number().nonnegative(),
  fatG: z.number().nonnegative(),
  sodiumMg: z.number().nonnegative(),
  ironMg: z.number().nonnegative(),
});
export type Nutrients = z.infer<typeof nutrientsSchema>;

const fileSchema = z.object({
  version: z.number(),
  /** Where the numbers come from, shown under the card. */
  source: z.string().min(1),
  recipes: z.record(z.string(), nutrientsSchema),
});

const file = fileSchema.parse(data);

export const nutritionSource: string = file.source;

/** Estimated nutrition per serving, calculated from USDA data, or undefined if not calculated. */
export function nutritionFor(recipeId: string): Nutrients | undefined {
  return file.recipes[recipeId];
}
