import type { InsightCategory } from '@/content/insight-categories';
import type { Insight } from '@/content/insights';
import type { Article } from '@/content/solids-articles';

import { articlesForAge, articleTiming } from './articles';
import type { Allergen } from './profile';
import type { Stage } from './stage';

/** One entry in the Insights library: a long article or a short daily insight. */
export type LibraryItem = {
  id: string;
  source: 'article' | 'insight';
  category: string;
  title: string;
  tone: Article['tone'];
  icon: string;
  emoji: string;
  fromMonths: number;
  toMonths: number;
  readMinutes: number;
};

/** Baby ages (months) each stage-tagged insight is most relevant for. */
const stageMonths: Record<Stage, [number, number]> = {
  newborn: [0, 5],
  solids: [6, 11],
  toddler: [12, 36],
};

export function readingMinutes(paragraphs: string[]): number {
  const words = paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function articleItem(a: Article): LibraryItem {
  return {
    id: a.id,
    source: 'article',
    category: a.category,
    title: a.title,
    tone: a.tone,
    icon: a.icon,
    emoji: a.emoji,
    fromMonths: a.fromMonths,
    toMonths: a.toMonths,
    readMinutes: a.readMinutes,
  };
}

export function insightItem(i: Insight): LibraryItem {
  const ranges = i.stages.map((s) => stageMonths[s]);
  return {
    id: i.id,
    source: 'insight',
    category: i.category,
    title: i.title,
    tone: i.tone,
    icon: i.icon,
    emoji: i.emoji,
    fromMonths: Math.min(...ranges.map((r) => r[0])),
    toMonths: Math.max(...ranges.map((r) => r[1])),
    readMinutes: readingMinutes(i.body),
  };
}

/** Every article and insight, leaving out insights with a household allergen. */
export function libraryItems(
  articles: Article[],
  insights: Insight[],
  avoid: Allergen[],
): LibraryItem[] {
  return [
    ...articles.map(articleItem),
    ...insights.filter((i) => !i.allergens.some((a) => avoid.includes(a))).map(insightItem),
  ];
}

export type LibrarySection = { category: InsightCategory; items: LibraryItem[] };

/** One section per category (in the given order), items for the baby's age first. */
export function librarySections(
  categories: InsightCategory[],
  items: LibraryItem[],
  ageMonths: number,
): LibrarySection[] {
  return categories
    .map((category) => ({
      category,
      items: articlesForAge(
        items.filter((i) => i.category === category.id),
        ageMonths,
      ),
    }))
    .filter((s) => s.items.length > 0);
}

/** "Picked for your baby's age": everything relevant right now, articles first. */
export function pickedForAge(items: LibraryItem[], ageMonths: number, count = 8): LibraryItem[] {
  const now = items.filter((i) => articleTiming(i, ageMonths) === 'now');
  const articles = now.filter((i) => i.source === 'article');
  const insights = now.filter((i) => i.source === 'insight');
  return [...articles, ...insights].slice(0, count);
}
