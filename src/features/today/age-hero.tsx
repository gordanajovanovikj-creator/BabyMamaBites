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
 * Top of Today (Apple-style): a long white pill with the baby's name and age, calendar and
 * settings, and the baby's initials
 * avatar (opens details) on top; a big greeting with the date underneath (opens the calendar); then a soft banner that opens this month's guide for baby and mom.
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
      <View className="gap-1">
        {/* iOS large-title layout: actions on top, the greeting big underneath. */}
        <View className="flex-row items-center justify-end gap-3">
          {/* One long white pill: baby's name and age, then calendar and settings. */}
          <View className="flex-shrink flex-row items-center rounded-full border border-border bg-surface pl-4 pr-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${name}, ${headline}${age.corrected ? ', adjusted age' : ''}. Update details.`}
              onPress={() => router.push('/onboarding')}
              className="min-h-12 flex-shrink justify-center pr-2 active:opacity-60"
            >
              <AppText variant="label" numberOfLines={1}>
                {name}
              </AppText>
              <AppText variant="caption" size="xs" color="primary" numberOfLines={1}>
                {headline}
                {age.corrected ? ' · adjusted' : ''}
              </AppText>
            </Pressable>
            <View className="h-7 w-px bg-border" />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Calendar: events, notes and planned meals"
              onPress={() => router.push('/calendar')}
              hitSlop={4}
              className="h-12 w-12 items-center justify-center active:opacity-60"
            >
              <SymbolIcon icon="calendar" emoji="📅" size={22} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Settings and reminders"
              onPress={() => router.push('/settings')}
              hitSlop={4}
              className="h-12 w-12 items-center justify-center active:opacity-60"
            >
              <SymbolIcon icon="ellipsis" emoji="⋯" size={22} />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${name}'s profile. Update details.`}
            onPress={() => router.push('/onboarding')}
            className="h-14 w-14 items-center justify-center rounded-full border-4 border-sky bg-primary active:opacity-80"
          >
            <AppText variant="heading" color="on-primary">
              {initials || '♡'}
            </AppText>
          </Pressable>
        </View>
        <AppText variant="display" accessibilityRole="header" className="pt-1">
          {greeting}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${formatToday()}. Opens your calendar.`}
          onPress={() => router.push('/calendar')}
          hitSlop={6}
          className="min-h-11 justify-center self-start active:opacity-70"
        >
          <AppText variant="body" color="muted">
            {formatToday()}
          </AppText>
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
