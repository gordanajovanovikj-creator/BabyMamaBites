import { z } from 'zod';

import creditsJson from './photo-credits.json';

export const photoSources = ['magnific', 'dreamstime', 'pixabay'] as const;
export type PhotoSource = (typeof photoSources)[number];

const creditSchema = z.object({
  /** Recipe, article or guide id the photo belongs to. */
  id: z.string().min(1),
  /** The title the photo appears on, shown to the user. */
  usedOn: z.string().min(1),
  source: z.enum(photoSources),
  author: z.string().min(1).nullable(),
  url: z.string().url().nullable(),
});
export type PhotoCredit = z.infer<typeof creditSchema>;

const file = z.object({ version: z.number(), credits: z.array(creditSchema) }).parse(creditsJson);

/** Stock photos that need (or get, as a courtesy) a credit. Mirrors docs/photo-credits.md. */
export const photoCredits: PhotoCredit[] = file.credits;
