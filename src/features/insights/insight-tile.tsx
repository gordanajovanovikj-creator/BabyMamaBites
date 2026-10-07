import { router } from 'expo-router';
import { View } from 'react-native';

import type { Insight } from '@/content/insights';
import { AppText, Card } from '@/ui';

import { insightKindLabel, insightTextColor } from './insight-style';

export const TILE_WIDTH = 168;

/** A square-ish, colourful tile in the daily insights row. */
export function InsightTile({ insight }: { insight: Insight }) {
  const color = insightTextColor[insight.tone];
  return (
    <Card
      tone={insight.tone}
      onPress={() => router.push({ pathname: '/insight/[id]', params: { id: insight.id } })}
      accessibilityLabel={`${insightKindLabel[insight.kind]}: ${insight.title}. ${insight.summary}`}
      className="min-h-52 justify-between gap-3"
      style={{ width: TILE_WIDTH }}
    >
      <View className="gap-2">
        <AppText
          variant="caption"
          color={color}
          className="text-sm font-semibold uppercase tracking-wider opacity-80"
        >
          {insightKindLabel[insight.kind]}
        </AppText>
        <AppText variant="heading" color={color} className="text-lg leading-6">
          {insight.title}
        </AppText>
      </View>
      <AppText variant="caption" color={color} className="text-sm opacity-90">
        {insight.summary}
      </AppText>
    </Card>
  );
}
