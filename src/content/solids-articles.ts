import { z } from 'zod';

import { illustrationNames } from './illustration-names';

import articlesJson from './solids-articles.json';

const sectionSchema = z.object({
  heading: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  bullets: z.array(z.string().min(1)),
  /**
   * "urgent": a red-flag section (when to call 911 or the pediatrician), shown as a
   * red callout. "support": a calm callout for helplines. Either gets call buttons
   * for the numbers it mentions.
   */
  callout: z.enum(['urgent', 'support']).optional(),
});

export const articleSchema = z
  .object({
    id: z.string().min(1),
    /** Insights library category (see insight-categories.json). */
    category: z.string().min(1),
    title: z.string().min(1),
    summary: z.string().min(1),
    /** "In short": 2 or 3 one-line takeaways shown at the top, drawn from the article itself. */
    keyPoints: z.array(z.string().min(1)).min(2).max(3).optional(),
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
