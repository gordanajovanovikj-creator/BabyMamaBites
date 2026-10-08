import { z } from 'zod';

import guidesJson from './monthly-guides.json';
import { reviewStatusSchema } from './schemas';

export const guideSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  reviewer: z.string().min(1),
});

export const monthlyGuideSchema = z.object({
  id: z.string().min(1),
  /** Completed months (adjusted age) this guide starts at, inclusive. */
  fromMonth: z.number().int().nonnegative(),
  /** Month it ends at, exclusive; null for the last, open-ended guide. */
  toMonth: z.number().int().positive().nullable(),
  stage: z.enum(['newborn', 'solids', 'toddler']),
  title: z.string().min(1),
  ageLabel: z.string().min(1),
  summary: z.string().min(1),
  intro: z.string().min(1),
  sections: z.array(guideSectionSchema).min(1),
  reviewStatus: reviewStatusSchema,
});
export type MonthlyGuide = z.infer<typeof monthlyGuideSchema>;

export const monthlyGuides: MonthlyGuide[] = z
  .object({ version: z.number(), guides: z.array(monthlyGuideSchema).min(1) })
  .parse(guidesJson).guides;
