import { z } from 'zod';

import { illustrationNames } from './illustration-names';

import articlesJson from './solids-articles.json';
import { reviewStatusSchema } from './schemas';

const sectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  bullets: z.array(z.string().min(1)),
});

export const articleSchema = z
  .object({
    id: z.string().min(1),
    /** Insights library category (see insight-categories.json). */
    category: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    /** Most relevant from this age in months (corrected age where it applies)… */
    fromMonths: z.number().int().nonnegative(),
    /** …up to and including this age. */
    toMonths: z.number().int().nonnegative(),
    icon: z.string().min(1),
    emoji: z.string().min(1),
    /** Vector illustration shown on cards. */
    illustration: z.enum(illustrationNames),
    tone: z.enum(['surface', 'muted', 'accent', 'sky', 'deep']),
    readMinutes: z.number().int().positive(),
    sections: z.array(sectionSchema).min(1),
    sources: z.array(z.string().min(1)).min(1),
    reviewStatus: reviewStatusSchema,
    reviewer: z.string().min(1),
  })
  .refine((a) => a.toMonths >= a.fromMonths, 'toMonths must not be before fromMonths');
export type Article = z.infer<typeof articleSchema>;

const file = z
  .object({
    version: z.number(),
    region: z.literal('US'),
    accessed: z.string(),
    articles: z.array(articleSchema).min(1),
  })
  .parse(articlesJson);

/** Starting-solids articles ("Insights" on the Plan tab). */
export const solidsArticles: Article[] = file.articles;
export const articlesAccessed = file.accessed;

export function getArticle(id: string): Article | undefined {
  return solidsArticles.find((a) => a.id === id);
}
