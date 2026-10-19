import { z } from 'zod';

/** An old review marker. Tests make sure no content text carries it. */
export const PLACEHOLDER_MARKER = '[PLACEHOLDER - needs expert review]';

export const copyBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});
export type CopyBlock = z.infer<typeof copyBlockSchema>;

export const copyCollectionSchema = z.object({
  version: z.number().int().positive(),
  blocks: z.array(copyBlockSchema).min(1),
});
