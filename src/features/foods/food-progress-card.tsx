import { View } from 'react-native';

import { foodCategoryLabels } from '@/content/foods';
import type { FoodProgress } from '@/domain/foods';
import { AppText, Card } from '@/ui';

/**
 * Warm, low-pressure progress for the Foods tab: how many foods the baby has
 * met, a bar, and a gentle note at each milestone. Never compares babies.
 */
function message(p: FoodProgress, name: string): string {
  if (p.tried === 0)
    return 'Every new taste is a little adventure. Tap a food to see how to serve it.';
  if (p.milestone === p.total) return `${name} has tried every food in the guide. What a journey!`;
  const next = p.toNext === 1 ? '1 more food' : `${p.toNext} more foods`;
  if (p.tried === 1) return `First taste done! ${next} to your next little milestone.`;
  return `${p.tried} foods met so far, at ${name}'s own pace. ${next} to the next milestone.`;
}

export function FoodProgressCard({ progress, name }: { progress: FoodProgress; name: string }) {
  const pct = progress.total ? progress.tried / progress.total : 0;
  return (
    <Card tone="muted" className="gap-3">
      <View className="flex-row items-end justify-between">
        <AppText variant="heading" size="2xl">
          {`${progress.tried} of ${progress.total} foods tried`}
        </AppText>
        {progress.milestone ? <AppText size="2xl">🎉</AppText> : <AppText size="2xl">🥄</AppText>}
      </View>
      <View
        className="h-2.5 overflow-hidden rounded-full bg-surface"
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: progress.total, now: progress.tried }}
        accessibilityLabel="Foods tried"
      >
        <View className="h-full rounded-full bg-primary" style={{ width: `${pct * 100}%` }} />
      </View>
      <AppText>{message(progress, name)}</AppText>
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {progress.byCategory.map((c) => (
          <AppText key={c.category} variant="caption" size="sm">
            {`${foodCategoryLabels[c.category]} ${c.tried}/${c.total}`}
          </AppText>
        ))}
      </View>
    </Card>
  );
}
