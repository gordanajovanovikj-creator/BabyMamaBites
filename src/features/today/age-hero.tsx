import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MonthlyGuide } from '@/content/monthly-guides';
import { today } from '@/domain/dates';
import type { Profile } from '@/domain/profile';
import { babyAge, formatAgeHeadline } from '@/domain/stage';
import { AppText, SymbolIcon } from '@/ui';

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
 * Top of Today: greeting and date on the left (tap to open the calendar); a pill with the baby's name,
 * age and initials (opens settings and details) on the right; then a soft banner that
 * opens this month's guide for baby and mom.
 */
export function AgeHero({ profile, guide }: { profile: Profile; guide?: MonthlyGuide }) {
  const insets = useSafeAreaInsets();
  const now = today();
  const age = babyAge(profile, now);
  const headline = formatAgeHeadline(age.countedFrom, now);
  const name = profile.babyName ?? 'Your baby';
  const initials = initialsFor(profile.babyName);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning!' : hour < 18 ? 'Good afternoon!' : 'Good evening!';

  return (
    <View className="gap-5 px-5" style={{ paddingTop: insets.top + 12 }}>
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${greeting} ${formatToday()}. Opens your calendar.`}
          onPress={() => router.push('/calendar')}
          hitSlop={6}
          className="min-h-12 flex-1 justify-center active:opacity-70"
        >
          <AppText variant="heading" size="xl" numberOfLines={1}>
            {greeting}
          </AppText>
          <View className="flex-row items-center gap-1.5">
            <SymbolIcon icon="calendar" emoji="📅" size={14} />
            <AppText
              variant="caption"
              size="sm"
              color="primary"
              className="font-semibold"
              numberOfLines={1}
            >
              {formatToday()}
            </AppText>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${name}, ${headline}${age.corrected ? ', adjusted age' : ''}. Opens settings and your details.`}
          onPress={() => router.push('/settings')}
          className="max-w-[55%] flex-row items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-4 pr-1.5 active:opacity-80"
        >
          <View className="flex-shrink items-end">
            <AppText variant="label" numberOfLines={1}>
              {name}
            </AppText>
            <AppText variant="caption" size="xs" numberOfLines={1}>
              {headline}
              {age.corrected ? ' · adjusted' : ''}
            </AppText>
          </View>
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <AppText variant="label" color="on-primary" className="font-bold">
              {initials || '♡'}
            </AppText>
          </View>
        </Pressable>
      </View>

      {guide ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${guide.title} with ${name}. ${guide.summary} Opens the guide.`}
          onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
          className="overflow-hidden rounded-3xl bg-sky px-5 py-6 active:opacity-90"
        >
          {/* Soft decorative shapes in the app's earthy accents. */}
          <View className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-deep opacity-15" />
          <View className="absolute -bottom-12 -right-6 h-40 w-40 rounded-full bg-accent" />
          <View className="gap-2">
            <AppText
              variant="caption"
              size="xs"
              color="on-sky"
              className="font-bold uppercase tracking-wider"
            >
              {guide.ageLabel}
            </AppText>
            <AppText variant="title" size="2xl" color="on-sky">
              {guide.title} with {name}
            </AppText>
            <AppText variant="body" color="on-sky">
              {guide.summary}
            </AppText>
            <AppText variant="label" color="primary" className="pt-1 font-bold">
              Read this month&apos;s guide ›
            </AppText>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}
