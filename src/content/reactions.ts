import { z } from 'zod';

import reactionsJson from './reactions.json';
import { reviewStatusSchema } from './schemas';

const reactionAdviceSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  signs: z.array(z.string().min(1)),
  action: z.string().min(1),
  sources: z.array(z.string().min(1)).min(1),
  reviewStatus: reviewStatusSchema,
  reviewer: z.string().min(1),
});
export type ReactionAdvice = z.infer<typeof reactionAdviceSchema>;

const fileSchema = z.object({
  version: z.number(),
  region: z.literal('US'),
  concerning: reactionAdviceSchema,
  mild: reactionAdviceSchema,
});

/** What to do after a reaction is logged. Escalates; never diagnoses. */
export const reactionAdvice = fileSchema.parse(reactionsJson);
