import type { Insight, InsightTone } from '@/content/insights';
import type { TextColor } from '@/ui/app-text';

export const insightTextColor: Record<InsightTone, TextColor> = {
  surface: 'ink',
  muted: 'ink',
  accent: 'on-accent',
  sky: 'on-sky',
  deep: 'on-deep',
};

export const insightKindLabel: Record<Insight['kind'], string> = {
  tip: 'Tip',
  recipe: 'Recipe idea',
  'self-care': 'For you',
  'when-to-call': 'When to get help',
};
