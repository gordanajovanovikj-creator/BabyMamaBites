import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Article } from '@/content/solids-articles';
import { ageRangeLabel, articleTiming } from '@/domain/articles';
import { AppText, cn, SymbolIcon, toneBackground } from '@/ui';

export const ARTICLE_TILE_WIDTH = 220;

export function articleKicker(article: Article, ageMonths: number): string {
  const timing = articleTiming(article, ageMonths);
  const when =
    timing === 'now' ? 'For now' : timing === 'coming-up' ? 'Coming up' : ageRangeLabel(article);
  return `${when} · ${article.readMinutes} min read`;
}

/** Picture-style article card for horizontal rows. */
export function ArticleTile({ article, ageMonths }: { article: Article; ageMonths: number }) {
  const kicker = articleKicker(article, ageMonths);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${article.title}. ${kicker}.`}
      onPress={() => router.push({ pathname: '/solids/article/[id]', params: { id: article.id } })}
      style={{ width: ARTICLE_TILE_WIDTH }}
      className="gap-2 active:opacity-80"
    >
      <View
        className={cn('h-32 items-center justify-center rounded-3xl', toneBackground(article.tone))}
      >
        <SymbolIcon icon={article.icon} emoji={article.emoji} size={48} />
      </View>
      <View className="gap-0.5 pr-2">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          {kicker}
        </AppText>
        <AppText variant="label" size="lg" className="font-bold leading-6" numberOfLines={2}>
          {article.title}
        </AppText>
      </View>
    </Pressable>
  );
}
