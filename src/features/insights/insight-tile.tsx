import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Insight } from '@/content/insights';
import { AppText, Card } from '@/ui';

import { insightKindLabel, insightTextColor } from './insight-style';
import { TileIllustration } from './tile-illustration';

export const TILE_WIDTH = 168;

/** A framed, colourful tile in the daily insights row: label, title and an illustration. */
export function InsightTile({ insight }: { insight: Insight }) {
  const color = insightTextColor[insight.tone];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${insightKindLabel[insight.kind]}: ${insight.title}. ${insight.summary}`}
      onPress={() => router.push({ pathname: '/insight/[id]', params: { id: insight.id } })}
      className="rounded-[30px] border-2 border-primary p-1 active:opacity-80"
      style={{ width: TILE_WIDTH }}
    >
      <Card tone={insight.tone} className="min-h-56 flex-1 justify-between gap-2 px-4 pb-3 pt-4">
        <View className="gap-1">
          <AppText
            variant="caption"
            color={color}
            size="xs"
            className="font-bold uppercase tracking-wider opacity-80"
          >
            {insightKindLabel[insight.kind]}
          </AppText>
          <AppText variant="heading" color={color} size="lg" className="leading-6">
            {insight.title}
          </AppText>
        </View>
        <TileIllustration
          icon={insight.icon}
          emoji={insight.emoji}
          onWhite={insight.tone === 'surface'}
        />
      </Card>
    </Pressable>
  );
}
