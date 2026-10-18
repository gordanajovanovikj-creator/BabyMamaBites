import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import Svg from 'react-native-svg';

import type { AllergenStatus } from '@/domain/food-log';
import { allergens, type Allergen } from '@/domain/profile';
import { allergenLabels } from '@/domain/profile-labels';
import { usePalette } from '@/theme/use-palette';
import { AppText, cn } from '@/ui';

import { AllergenIcon } from './allergen-icons';

const statusLabel: Record<AllergenStatus, string> = {
  'not-tried': 'not offered yet',
  tried: 'offered',
  reaction: 'reaction logged',
};

const circleClasses: Record<AllergenStatus, string> = {
  'not-tried': 'border-2 border-dashed border-border bg-surface',
  tried: 'bg-primary',
  reaction: 'bg-danger-bg',
};

function AllergenTile({
  allergen,
  status,
  width,
}: {
  allergen: Allergen;
  status: AllergenStatus;
  /** Grid cell (a fifth of the row) or a fixed-width tile in a scrolling row. */
  width: 'fifth' | 'fixed';
}) {
  const palette = usePalette();
  const iconColor =
    status === 'tried'
      ? palette.canvas
      : status === 'reaction'
        ? palette.dangerInk
        : palette.inkMuted;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${allergenLabels[allergen]}: ${statusLabel[status]}`}
      accessibilityHint="Opens Log a food with this allergen picked"
      onPress={() => router.push({ pathname: '/solids/log', params: { allergen } })}
      className={cn(
        'items-center gap-1 py-1 active:opacity-70',
        width === 'fifth' ? 'w-1/5' : 'w-16',
      )}
    >
      <View
        className={cn('h-14 w-14 items-center justify-center rounded-full', circleClasses[status])}
      >
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <AllergenIcon allergen={allergen} color={iconColor} />
        </Svg>
        {status !== 'not-tried' ? (
          <View
            className={cn(
              'absolute -bottom-0.5 -right-0.5 h-5 w-5 items-center justify-center rounded-full border-2 border-surface',
              status === 'tried' ? 'bg-primary' : 'bg-danger-ink',
            )}
          >
            <AppText size="xs" color="on-primary" className="font-bold leading-4">
              {status === 'tried' ? '✓' : '!'}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText
        size="sm"
        color={status === 'reaction' ? 'danger' : status === 'tried' ? 'ink' : 'muted'}
        className={cn('w-full text-center leading-4', status !== 'not-tried' && 'font-bold')}
      >
        {allergenLabels[allergen]}
      </AppText>
    </Pressable>
  );
}

export type AllergenTrackerProps = {
  progress: Record<Allergen, AllergenStatus>;
  /** Show the "Plan ›" link (on Today; the Plan tab already is the plan). */
  linkToPlan?: boolean;
  /** Side padding for pages whose content isn't already padded. */
  padded?: boolean;
  /** Shorter version (Today): one sideways row of tiles, offered ones first. */
  compact?: boolean;
};

/**
 * The allergen tracker (Today and the Plan tab): a cream card with a nine-step progress bar and a round
 * tile per major US allergen (green with a check once offered). Tap one to log it.
 * Status is in the text label too, not only the color.
 */
export function AllergenTracker({
  progress,
  linkToPlan = false,
  padded = false,
  compact = false,
}: AllergenTrackerProps) {
  const offered = allergens.filter((a) => progress[a] !== 'not-tried').length;
  return (
    <View className={padded ? 'px-5' : undefined}>
      <View className="gap-4 rounded-3xl bg-accent p-5">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1 gap-0.5">
            <AppText variant="heading" size="2xl" color="on-accent">
              Allergen tracker
            </AppText>
            <AppText variant="caption" size="sm" color="on-accent">
              {offered === 0
                ? 'Tap one when your baby tries it.'
                : `${offered} of ${allergens.length} offered · tap one to log it`}
            </AppText>
          </View>
          {linkToPlan ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View the allergen tracker on the Plan tab"
              onPress={() =>
                router.navigate({
                  pathname: '/baby',
                  params: { tab: 'plan', at: String(Date.now()) },
                })
              }
              hitSlop={8}
              className="min-h-11 justify-center active:opacity-60"
            >
              <AppText variant="label" color="on-accent" className="font-bold">
                Plan ›
              </AppText>
            </Pressable>
          ) : null}
        </View>

        <View
          className="flex-row gap-1"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          {allergens.map((a, i) => (
            <View
              key={a}
              className={cn('h-2 flex-1 rounded-full', i < offered ? 'bg-primary' : 'bg-surface')}
            />
          ))}
        </View>

        {compact ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-5"
            contentContainerClassName="gap-1 px-4"
          >
            {[
              ...allergens.filter((a) => progress[a] !== 'not-tried'),
              ...allergens.filter((a) => progress[a] === 'not-tried'),
            ].map((a) => (
              <AllergenTile key={a} allergen={a} status={progress[a]} width="fixed" />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-row flex-wrap rounded-2xl bg-surface px-1 py-3">
            {allergens.map((a) => (
              <AllergenTile key={a} allergen={a} status={progress[a]} width="fifth" />
            ))}
          </View>
        )}

        {allergens.some((a) => progress[a] === 'reaction') ? (
          <AppText variant="caption" color="danger">
            You logged a reaction. Talk to your pediatrician before offering that food again.
          </AppText>
        ) : null}
      </View>
    </View>
  );
}
