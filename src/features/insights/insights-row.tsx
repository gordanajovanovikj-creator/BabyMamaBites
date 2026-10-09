import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Insight } from '@/content/insights';
import { AppText } from '@/ui';

import { AskTile } from './ask-tile';
import { InsightTile } from './insight-tile';

/** "My daily insights · Today": a horizontally scrolling row of tiles. */
export function InsightsRow({ insights }: { insights: Insight[] }) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <AppText variant="heading" size="2xl" className="flex-1">
          My daily insights · Today
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all insights"
          onPress={() => router.push('/insights')}
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
        snapToInterval={168 + 12}
        contentContainerClassName="gap-3 px-5 pb-1"
      >
        <AskTile />
        {insights.map((insight) => (
          <InsightTile key={insight.id} insight={insight} />
        ))}
      </ScrollView>
    </View>
  );
}
