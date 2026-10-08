import { View } from 'react-native';

import type { AllergenStatus } from '@/domain/food-log';
import { allergens, type Allergen } from '@/domain/profile';
import { allergenLabels } from '@/domain/profile-labels';
import { AppText, Card, cn } from '@/ui';

const statusText: Record<AllergenStatus, { mark: string; label: string }> = {
  'not-tried': { mark: '○', label: 'not tried yet' },
  tried: { mark: '✓', label: 'tried' },
  reaction: { mark: '!', label: 'reaction logged' },
};

export type AllergenTrackerProps = {
  progress: Record<Allergen, AllergenStatus>;
};

/** The nine major US allergens and whether each has been offered. Status uses text, not just color. */
export function AllergenTracker({ progress }: AllergenTrackerProps) {
  const tried = allergens.filter((a) => progress[a] !== 'not-tried').length;
  return (
    <Card className="gap-3">
      <View className="gap-1">
        <AppText variant="heading">Allergen tracker</AppText>
        <AppText variant="caption">
          {tried} of {allergens.length} major allergens offered
        </AppText>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {allergens.map((a) => {
          const status = progress[a];
          const { mark, label } = statusText[status];
          return (
            <View
              key={a}
              accessible
              accessibilityLabel={`${allergenLabels[a]}: ${label}`}
              className={cn(
                'min-h-11 flex-row items-center gap-2 rounded-full px-4 py-2',
                status === 'tried' && 'bg-surface-muted',
                status === 'reaction' && 'bg-danger-bg',
                status === 'not-tried' && 'border border-border',
              )}
            >
              <AppText
                variant="label"
                color={status === 'reaction' ? 'danger' : status === 'tried' ? 'primary' : 'muted'}
                className="font-bold"
              >
                {mark}
              </AppText>
              <AppText variant="label" color={status === 'reaction' ? 'danger' : 'ink'}>
                {allergenLabels[a]}
              </AppText>
            </View>
          );
        })}
      </View>
      {allergens.some((a) => progress[a] === 'reaction') ? (
        <AppText variant="caption" color="danger">
          You logged a reaction. Talk to your pediatrician before offering that food again.
        </AppText>
      ) : null}
    </Card>
  );
}
