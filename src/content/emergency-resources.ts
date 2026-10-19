import { z } from 'zod';

import data from './emergency-resources.json';

const helpline = z.enum(['911', '988', 'tlc-mama', 'psi', 'poison']);

const fileSchema = z.object({
  version: z.number(),
  reviewer: z.string().min(1),
  intro: z.string().min(1),
  groups: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        body: z.string().min(1),
        lines: z.array(helpline).min(1),
        urgent: z.boolean(),
      }),
    )
    .min(1),
  resources: z.array(
    z.object({ label: z.string().min(1), detail: z.string().min(1), url: z.url() }),
  ),
});

/** The Emergency & resources page: who to call, then trusted places to read more. */
export const emergencyResources = fileSchema.parse(data);
