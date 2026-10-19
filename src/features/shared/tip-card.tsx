import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { splitTips } from '@/domain/tips';
import { AppText, haptics, SymbolIcon } from '@/ui';

function Arrow({ label, glyph, onPress }: { label: string; glyph: string; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      hitSlop={4}
      className={
        onPress
          ? 'h-12 w-12 items-center justify-center rounded-full active:opacity-60'
          : 'h-12 w-12 items-center justify-center rounded-full opacity-30'
      }
    >
      <AppText size="2xl" color="on-sky" className="font-bold">
        {glyph}
      </AppText>
    </Pressable>
  );
}

/** Choking and allergen tips: always shown in full, never in the carousel or skippable. */
function SafetyTips({ tips }: { tips: string[] }) {
  return (
    <View className="gap-2 rounded-3xl bg-caution-bg px-5 py-4" accessibilityRole="summary">
      <View className="flex-row items-center gap-2" accessibilityRole="header">
        <AppText size="lg">⚠️</AppText>
        <AppText variant="label" color="caution" className="font-bold">
          Safety tip
        </AppText>
      </View>
      {tips.map((t) => (
        <AppText key={t} color="caution">
          {t}
        </AppText>
      ))}
    </View>
  );
}

/**
 * Tips for a recipe, food or week: choking and allergen tips always show in their own
 * card; the rest go in the carousel below.
 */
export function TipCard({ tips }: { tips: string[] }) {
  const { safety, other } = splitTips(tips);
  return (
    <View className="gap-3">
      {safety.length ? <SafetyTips tips={safety} /> : null}
      <TipCarousel tips={other} />
    </View>
  );
}

/**
 * Tips one at a time on a soft sage card: a "Tip!" label with a count (2/3), the
 * tip, and ‹ › to move between them. "Skip" tucks the card away for this visit.
 */
function TipCarousel({ tips }: { tips: string[] }) {
  const [index, setIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);
  if (!tips.length || skipped) return null;
  const i = Math.min(index, tips.length - 1);
  const many = tips.length > 1;

  return (
    <View className="gap-2 rounded-3xl bg-sky px-5 pb-2 pt-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2" accessibilityRole="header">
          <SymbolIcon icon="lightbulb" emoji="💡" size={20} />
          <AppText variant="label" color="on-sky" className="font-bold">
            Tip!
          </AppText>
        </View>
        {many ? (
          <AppText
            variant="caption"
            color="on-sky"
            accessibilityLabel={`Tip ${i + 1} of ${tips.length}`}
          >
            {`${i + 1}/${tips.length}`}
          </AppText>
        ) : null}
      </View>
      <AppText color="on-sky" accessibilityLiveRegion="polite">
        {tips[i]}
      </AppText>
      <View className="flex-row items-center justify-end">
        {many ? (
          <View className="flex-1 flex-row justify-center gap-4">
            <Arrow
              label="Previous tip"
              glyph="‹"
              onPress={i > 0 ? () => setIndex(i - 1) : undefined}
            />
            <Arrow
              label="Next tip"
              glyph="›"
              onPress={i < tips.length - 1 ? () => setIndex(i + 1) : undefined}
            />
          </View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip tips"
          onPress={() => setSkipped(true)}
          hitSlop={4}
          className="min-h-12 justify-center px-2 active:opacity-60"
        >
          <AppText variant="label" color="on-sky" className="font-semibold">
            Skip
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
