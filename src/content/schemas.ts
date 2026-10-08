import { z } from 'zod';

/**
 * Every piece of health-adjacent content carries a review status so the app
 * (and reviewers) can see what still needs a credentialed expert's sign-off.
 */
export const reviewStatusSchema = z.enum(['placeholder', 'reviewed']);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const PLACEHOLDER_MARKER = '[PLACEHOLDER - needs expert review]';

export const copyBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  reviewStatus: reviewStatusSchema,
  /** Who needs to review it, e.g. "legal", "dietitian", "pediatrician". */
  reviewer: z.string().min(1),
});
export type CopyBlock = z.infer<typeof copyBlockSchema>;

export const copyCollectionSchema = z.object({
  version: z.number().int().positive(),
  blocks: z.array(copyBlockSchema).min(1),
});
export type CopyCollection = z.infer<typeof copyCollectionSchema>;

/** Splits a leading review marker off text for display (the marker stays in the content file). */
export function splitReviewMarker(text: string): { text: string; isDraft: boolean } {
  if (!text.startsWith(PLACEHOLDER_MARKER)) return { text, isDraft: false };
  return { text: text.slice(PLACEHOLDER_MARKER.length).trimStart(), isDraft: true };
}
