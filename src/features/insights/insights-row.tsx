import { ScrollView, View } from 'react-native';

import type { Insight } from '@/content/insights';
import { AppText } from '@/ui';

import { AskTile } from './ask-tile';
import { InsightTile } from './insight-tile';

/** "My daily insights · Today": a horizontally scrolling row of tiles. */
export function InsightsRow({ insights }: { insights: Insight[] }) {
  return (
    <View className="gap-3">
      <AppText variant="heading" className="px-5 text-2xl">
        My daily insights · Today
      </AppText>
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
