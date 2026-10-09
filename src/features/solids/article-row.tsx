import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Article } from '@/content/solids-articles';
import { ageRangeLabel } from '@/domain/articles';
import { AppText, cn, SymbolIcon, toneBackground } from '@/ui';

/** List row for an article: icon tile, age range and title. */
export function ArticleRow({ article }: { article: Article }) {
  const meta = `${ageRangeLabel(article)} · ${article.readMinutes} min read`;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${article.title}. ${meta}.`}
      onPress={() => router.push({ pathname: '/solids/article/[id]', params: { id: article.id } })}
      className="min-h-20 flex-row items-center gap-4 border-b border-border py-3 active:opacity-70"
    >
      <View
        className={cn(
          'h-16 w-16 items-center justify-center rounded-2xl',
          toneBackground(article.tone),
        )}
      >
        <SymbolIcon icon={article.icon} emoji={article.emoji} size={28} />
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="label" size="lg" className="font-bold">
          {article.title}
        </AppText>
        <AppText variant="caption" size="sm">
          {meta}
        </AppText>
      </View>
      <AppText variant="heading" color="muted">
        ›
      </AppText>
    </Pressable>
  );
}
