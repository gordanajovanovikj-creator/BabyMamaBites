import { z } from 'zod';

import categoriesJson from './insight-categories.json';

export const insightCategorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** SF Symbol name (iOS). */
  icon: z.string().min(1),
  /** Stand-in where SF Symbols aren't available. */
  emoji: z.string().min(1),
  tone: z.enum(['surface', 'muted', 'accent', 'sky', 'deep']),
  /** Whether the category is about mom or about the baby. */
  audience: z.enum(['mom', 'baby']),
  description: z.string().min(1),
});
export type InsightCategory = z.infer<typeof insightCategorySchema>;

export const insightCategories: InsightCategory[] = z
  .object({ version: z.number(), categories: z.array(insightCategorySchema).min(1) })
  .parse(categoriesJson).categories;

export function getInsightCategory(id: string): InsightCategory | undefined {
  return insightCategories.find((c) => c.id === id);
}
