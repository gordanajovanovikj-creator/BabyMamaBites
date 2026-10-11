import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { MonthlyGuide } from '@/content/monthly-guides';
import { today } from '@/domain/dates';
import type { Profile } from '@/domain/profile';
import { babyAge, formatAge } from '@/domain/stage';
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
 * Top of Today (Apple-style): a big greeting, a white pill with the baby's name and age
 * (opens details) and the initials avatar (opens settings); the date underneath opens the
 * calendar; then a soft banner that opens this month's guide for baby and mom.
 */
export function AgeHero({ profile, guide }: { profile: Profile; guide?: MonthlyGuide }) {
  const insets = useSafeAreaInsets();
  const now = today();
  const age = babyAge(profile, now);
  const shortAge = formatAge(age);
  const name = profile.babyName ?? 'Your baby';
  const initials = initialsFor(profile.babyName);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning!' : hour < 18 ? 'Good afternoon!' : 'Good evening!';

  return (
    <View className="gap-5 px-5" style={{ paddingTop: insets.top + 12 }}>
      <View className="gap-1">
        {/* Apple-style large title row: greeting, a white pill with the baby, the avatar. */}
        <View className="flex-row items-center gap-3">
          <AppText
            variant="display"
            size="3xl"
            className="flex-1"
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            accessibilityRole="header"
          >
            {greeting}
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${name}, ${shortAge}${age.corrected ? ', adjusted age' : ''}. Update details.`}
            onPress={() => router.push('/onboarding')}
            className="min-h-12 max-w-[40%] justify-center rounded-full border border-border bg-surface px-5 py-1.5 active:opacity-70"
          >
            <AppText variant="label" numberOfLines={1} className="text-center">
              {name}
            </AppText>
            <AppText
              variant="caption"
              size="xs"
              color="primary"
              numberOfLines={1}
              className="text-center"
            >
              {shortAge}
              {age.corrected ? ' · adjusted' : ''}
            </AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Settings, reminders and your details"
            onPress={() => router.push('/settings')}
            className="h-14 w-14 items-center justify-center rounded-full border-4 border-sky bg-primary active:opacity-80"
          >
            <AppText variant="heading" color="on-primary">
              {initials || '♡'}
            </AppText>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${formatToday()}. Opens your calendar.`}
          onPress={() => router.push('/calendar')}
          hitSlop={6}
          className="min-h-11 flex-row items-center gap-2 self-start active:opacity-70"
        >
          <SymbolIcon icon="calendar" emoji="📅" size={18} />
          <AppText variant="body" color="primary" className="font-semibold">
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
