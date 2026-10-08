import { z } from 'zod';

import guidesJson from './monthly-guides.json';
import { reviewStatusSchema } from './schemas';

export const guideSourceSchema = z.object({
  id: z.string().min(1),
  publisher: z.string().min(1),
  title: z.string().min(1),
  url: z.url(),
});
export type GuideSource = z.infer<typeof guideSourceSchema>;

export const guideSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)),
  /** Where official sources disagree (e.g. US vs UK guidance). */
  note: z.string().min(1).optional(),
  /** Ids into the `sources` list. */
  sources: z.array(z.string().min(1)).min(1),
  reviewer: z.string().min(1),
});
export type GuideSection = z.infer<typeof guideSectionSchema>;

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

const fileSchema = z.object({
  version: z.number(),
  /** Country whose official guidance the guides follow. */
  region: z.literal('US'),
  /** Date the official sources were read. */
  accessed: z.string(),
  sources: z.array(guideSourceSchema).min(1),
  guides: z.array(monthlyGuideSchema).min(1),
});

const file = fileSchema.parse(guidesJson);

export const monthlyGuides: MonthlyGuide[] = file.guides;
export const guideSources: GuideSource[] = file.sources;
export const guideSourcesAccessed: string = file.accessed;

export function getGuideSource(id: string): GuideSource | undefined {
  return guideSources.find((s) => s.id === id);
}
