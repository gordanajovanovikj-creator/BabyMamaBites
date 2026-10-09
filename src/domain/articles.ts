/** How an article's age range relates to the baby's age. */
export type ArticleTiming = 'now' | 'coming-up' | 'earlier';

type AgeRange = { fromMonths: number; toMonths: number };

export function articleTiming(article: AgeRange, ageMonths: number): ArticleTiming {
  if (ageMonths < article.fromMonths) return 'coming-up';
  if (ageMonths > article.toMonths) return 'earlier';
  return 'now';
}

const timingOrder: Record<ArticleTiming, number> = { now: 0, 'coming-up': 1, earlier: 2 };

/**
 * Articles for this age: relevant now first, then coming up (soonest first),
 * then earlier ones (most recent first). Stable for equal ranges.
 */
export function articlesForAge<A extends AgeRange>(articles: A[], ageMonths: number): A[] {
  return articles
    .map((article, index) => ({ article, index, timing: articleTiming(article, ageMonths) }))
    .sort((a, b) => {
      const byTiming = timingOrder[a.timing] - timingOrder[b.timing];
      if (byTiming) return byTiming;
      if (a.timing === 'earlier')
        return b.article.toMonths - a.article.toMonths || a.index - b.index;
      return a.article.fromMonths - b.article.fromMonths || a.index - b.index;
    })
    .map((x) => x.article);
}

/** "4 to 7 months" / "From 12 months" style label. */
export function ageRangeLabel({ fromMonths, toMonths }: AgeRange): string {
  if (toMonths >= 24) return `From ${fromMonths} months`;
  return `${fromMonths} to ${toMonths} months`;
}
