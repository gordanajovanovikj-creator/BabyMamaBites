import { z } from 'zod';

import { allergens } from '@/domain/profile';

import { getGuideSource, guideSourceSchema, type GuideSource } from './monthly-guides';
import plan from './solids-plan.json';
import { reviewStatusSchema } from './schemas';

export const textureStages = ['smooth', 'thicker', 'lumpy', 'chopped', 'family'] as const;
export type TextureStage = (typeof textureStages)[number];

const stageSchema = z.object({
  id: z.enum(textureStages),
  label: z.string().min(1),
  description: z.string().min(1),
  sources: z.array(z.string()).min(1),
});

export const planWeekSchema = z.object({
  week: z.number().int().positive(),
  title: z.string().min(1),
  stage: z.enum(textureStages),
  focus: z.array(z.string().min(1)).min(1),
  tryFoods: z.array(z.string().min(1)).min(1),
  allergen: z
    .object({ id: z.enum(allergens), label: z.string().min(1), howTo: z.string().min(1) })
    .nullable(),
  tips: z.array(z.string().min(1)),
  sources: z.array(z.string().min(1)).min(1),
  reviewStatus: reviewStatusSchema,
  reviewer: z.string().min(1),
});
export type PlanWeek = z.infer<typeof planWeekSchema>;

const quickFoodSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  allergen: z.enum(allergens).nullable(),
  emoji: z.string().min(1),
});
export type QuickFood = z.infer<typeof quickFoodSchema>;

const fileSchema = z.object({
  version: z.number(),
  region: z.literal('US'),
  accessed: z.string(),
  stages: z.array(stageSchema).min(1),
  weeks: z.array(planWeekSchema).min(1),
  readiness: z.object({
    intro: z.string().min(1),
    signs: z.array(z.string().min(1)).min(1),
    sources: z.array(z.string()).min(1),
  }),
  choking: z.object({
    intro: z.string().min(1),
    signs: z.array(z.string().min(1)).min(1),
    groups: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          items: z.array(z.string().min(1)).min(1),
          sources: z.array(z.string()).min(1),
        }),
      )
      .min(1),
  }),
  quickFoods: z.array(quickFoodSchema).min(1),
  sources: z.array(guideSourceSchema).min(1),
});

const file = fileSchema.parse(plan);

export const planWeeks: PlanWeek[] = file.weeks;
export const textureStageInfo = file.stages;
export const readiness = file.readiness;
export const chokingGuide = file.choking;
export const quickFoods: QuickFood[] = file.quickFoods;
export const solidsSources: GuideSource[] = file.sources;
export const solidsAccessed = file.accessed;

export function getPlanWeek(week: number): PlanWeek | undefined {
  return planWeeks.find((w) => w.week === week);
}

export function getStageInfo(id: TextureStage) {
  return textureStageInfo.find((s) => s.id === id);
}

/** Looks in the solids sources first, then the monthly guides' registry. */
export function getSolidsSource(id: string): GuideSource | undefined {
  return solidsSources.find((s) => s.id === id) ?? getGuideSource(id);
}

export function solidsSourcesFor(ids: string[]): GuideSource[] {
  return ids.map(getSolidsSource).filter((s) => s !== undefined);
}
