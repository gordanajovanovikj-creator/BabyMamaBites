import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { solidsArticles } from '@/content/solids-articles';
import { articlesForAge } from '@/domain/articles';
import { AppText } from '@/ui';

import { ARTICLE_TILE_WIDTH, ArticleTile } from './article-tile';

/** "Insights": starting-solids articles, the ones for the baby's age first. */
export function ArticlesRow({ ageMonths }: { ageMonths: number }) {
  const ordered = articlesForAge(solidsArticles, ageMonths);
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <AppText variant="heading" size="2xl" className="flex-1">
          Insights
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all insights"
          onPress={() => router.push('/solids/articles')}
          hitSlop={8}
          className="min-h-11 flex-row items-center justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            See all ›
          </AppText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ARTICLE_TILE_WIDTH + 16}
        contentContainerClassName="gap-4 px-5"
      >
        {ordered.map((a) => (
          <ArticleTile key={a.id} article={a} ageMonths={ageMonths} />
        ))}
      </ScrollView>
    </View>
  );
}
