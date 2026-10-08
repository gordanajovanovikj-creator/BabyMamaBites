import type { MonthlyGuide } from '@/content/monthly-guides';

/** The guide covering a baby's age in completed months (adjusted age where it applies). */
export function guideForMonths(guides: MonthlyGuide[], months: number): MonthlyGuide | undefined {
  return guides.find((g) => months >= g.fromMonth && (g.toMonth === null || months < g.toMonth));
}

/** Guides either side of `id`, for browsing back and forward. */
export function adjacentGuides(
  guides: MonthlyGuide[],
  id: string,
): { previous?: MonthlyGuide; next?: MonthlyGuide } {
  const sorted = [...guides].sort((a, b) => a.fromMonth - b.fromMonth);
  const i = sorted.findIndex((g) => g.id === id);
  if (i < 0) return {};
  return { previous: sorted[i - 1], next: sorted[i + 1] };
}
