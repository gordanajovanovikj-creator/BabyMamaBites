import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MonthlyGuide } from '@/content/monthly-guides';
import { today } from '@/domain/dates';
import type { Profile } from '@/domain/profile';
import { babyAge, formatAgeHeadline, monthChoices } from '@/domain/stage';
import { usePalette } from '@/theme/use-palette';
import { AppText, cn } from '@/ui';

function formatToday(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Up to two initials, Apple-style: "Mila Rose" → "MR". */
export function initialsFor(name: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/**
 * Top of Today: the date (opens the calendar), a short greeting with the baby's age, one
 * round avatar (opens settings and details), then the month's guide card with ‹ › arrows
 * to look at other months.
 */
export type AgeHeroProps = {
  profile: Profile;
  /** The guide for the month being viewed. */
  guide?: MonthlyGuide;
  /** The month being viewed, and the one that matches the baby's age now. */
  selectedMonth?: number;
  currentMonth?: number;
  onSelectMonth(months: number): void;
};

function ArrowButton({
  label,
  symbol,
  fallback,
  onPress,
}: {
  label: string;
  symbol: 'chevron.left' | 'chevron.right';
  fallback: string;
  onPress?: () => void;
}) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full bg-surface active:opacity-70',
        !onPress && 'opacity-40',
      )}
    >
      <SymbolView
        name={symbol}
        size={16}
        weight="bold"
        tintColor={palette.ink}
        fallback={<AppText className="font-bold">{fallback}</AppText>}
      />
    </Pressable>
  );
}

export function AgeHero({
  profile,
  guide,
  selectedMonth,
  currentMonth,
  onSelectMonth,
}: AgeHeroProps) {
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  const now = today();
  const age = babyAge(profile, now);
  const name = profile.babyName ?? 'Your baby';
  const initials = initialsFor(profile.babyName);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const ageLine = `${name} is ${formatAgeHeadline(age.countedFrom, now)} old${age.corrected ? ' (adjusted)' : ''}`;

  const choices = monthChoices();
  const index = choices.findIndex((c) => c.months === selectedMonth);
  const prev = index > 0 ? choices[index - 1] : undefined;
  const next = index < 0 ? choices[0] : choices[index + 1];
  const kicker =
    selectedMonth === undefined || selectedMonth === currentMonth
      ? 'This month'
      : currentMonth !== undefined && selectedMonth < currentMonth
        ? 'Looking back'
        : 'Coming up';

  return (
    <View className="gap-5 px-5" style={{ paddingTop: insets.top + 8 }}>
      <View className="gap-1">
        <View className="flex-row items-center justify-between gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${formatToday()}. Opens your calendar.`}
            onPress={() => router.push('/calendar')}
            hitSlop={6}
            className="min-h-12 flex-1 justify-center active:opacity-70"
          >
            <AppText variant="label" size="sm" color="muted" className="uppercase tracking-wider">
              {`${formatToday()} ›`}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${name}'s details, reminders and settings`}
            onPress={() => router.push('/settings')}
            className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary active:opacity-80"
          >
            <LinearGradient
              colors={[palette.primaryLight, palette.primary]}
              start={{ x: 0.15, y: 0 }}
              end={{ x: 0.85, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <AppText variant="heading" color="on-primary">
              {initials || '♡'}
            </AppText>
          </Pressable>
        </View>
        <AppText variant="display" size="3xl" accessibilityRole="header">
          {`${greeting}, mama`}
        </AppText>
        <AppText variant="body" color="muted">
          {ageLine}
        </AppText>
      </View>

      {guide ? (
        <View className="overflow-hidden rounded-3xl bg-sky">
          {/* Soft decorative shapes in the app's earthy accents. */}
          <View className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-deep opacity-15" />
          <View className="absolute -bottom-12 -right-6 h-40 w-40 rounded-full bg-accent" />
          <View className="flex-row items-center justify-between gap-2 px-5 pt-4">
            <AppText
              variant="caption"
              size="xs"
              color="on-sky"
              className="flex-1 font-bold uppercase tracking-wider"
            >
              {kicker}
            </AppText>
            <View className="flex-row gap-2">
              <ArrowButton
                label={prev ? `Show ${prev.label}` : 'No earlier month'}
                symbol="chevron.left"
                fallback="‹"
                onPress={prev ? () => onSelectMonth(prev.months) : undefined}
              />
              <ArrowButton
                label={next ? `Show ${next.label}` : 'No later month'}
                symbol="chevron.right"
                fallback="›"
                onPress={next ? () => onSelectMonth(next.months) : undefined}
              />
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${guide.title} with ${name}. ${guide.summary} Opens the guide.`}
            onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
            className="gap-2 px-5 pb-6 pt-1 active:opacity-90"
          >
            <AppText variant="title" size="2xl" color="on-sky">
              {`${guide.title} with ${name}`}
            </AppText>
            <AppText variant="body" color="on-sky">
              {guide.summary}
            </AppText>
            <AppText variant="label" color="primary" className="pt-1 font-bold">
              Read the guide ›
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
