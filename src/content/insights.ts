import { z } from 'zod';

import { illustrationNames } from './illustration-names';

import { allergens } from '@/domain/profile';

import insightsJson from './insights.json';
import { reviewStatusSchema } from './schemas';

export const insightSchema = z.object({
  id: z.string().min(1),
  /** Insights library category (see insight-categories.json). */
  category: z.string().min(1),
  stages: z.array(z.enum(['newborn', 'solids', 'toddler'])).min(1),
  kind: z.enum(['tip', 'recipe', 'self-care', 'when-to-call']),
  tone: z.enum(['surface', 'muted', 'accent', 'sky', 'deep']),
  /** SF Symbol name for the tile illustration (iOS). */
  icon: z.string().min(1),
  /** Stand-in shown where SF Symbols aren't available (Android, web). */
  emoji: z.string().min(1),
  /** Vector illustration shown on cards. */
  illustration: z.enum(illustrationNames),
  title: z.string().min(1).max(48),
  summary: z.string().min(1),
  body: z.array(z.string().min(1)).min(1),
  /** Allergens the insight's food contains; hidden for households avoiding them. */
  allergens: z.array(z.enum(allergens)),
  reviewStatus: reviewStatusSchema,
  reviewer: z.string().min(1),
});
export type Insight = z.infer<typeof insightSchema>;
export type InsightTone = Insight['tone'];

export const insights: Insight[] = z
  .object({ version: z.number(), insights: z.array(insightSchema) })
  .parse(insightsJson).insights;

export function getInsight(id: string): Insight | undefined {
  return insights.find((i) => i.id === id);
}
