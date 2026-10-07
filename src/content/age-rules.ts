import { z } from 'zod';

import ageRulesJson from './config/age-rules.json';
import { reviewStatusSchema } from './schemas';

export const ageRulesSchema = z.object({
  version: z.number().int().positive(),
  reviewStatus: reviewStatusSchema,
  reviewer: z.string().min(1),
  note: z.string(),
  stageStartMonths: z.object({
    solids: z.number().int().positive(),
    toddler: z.number().int().positive(),
  }),
  correctedAge: z.object({
    /** Only babies born at least this many days before their due date use corrected age. */
    minDaysEarly: z.number().int().nonnegative(),
    /** Stop correcting once the baby's actual age reaches this many months. */
    useUntilMonths: z.number().int().positive(),
  }),
});
export type AgeRules = z.infer<typeof ageRulesSchema>;

export const ageRules: AgeRules = ageRulesSchema.parse(ageRulesJson);
