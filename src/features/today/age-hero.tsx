import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { today } from '@/domain/dates';
import type { Profile } from '@/domain/profile';
import { babyAge, babyStage, formatAgeHeadline, solidsWeek } from '@/domain/stage';
import { stageLabels } from '@/domain/stage-labels';
import { AppText, Button, IconButton } from '@/ui';

function formatToday(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Top of Today: date and greeting with calendar and settings, a baby card, one action. */
export function AgeHero({ profile }: { profile: Profile }) {
  const insets = useSafeAreaInsets();
  const now = today();
  const age = babyAge(profile, now);
  const stage = babyStage(profile, now);
  const week = stage === 'solids' ? solidsWeek(profile, now) : null;
  const headline = formatAgeHeadline(age.countedFrom, now);
  const name = profile.babyName ?? 'Your baby';
  const stageLine = [
    stageLabels[stage].title,
    week ? `Week ${week}` : null,
    age.corrected ? 'Adjusted age' : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning, mama' : hour < 18 ? 'Good afternoon, mama' : 'Good evening, mama';
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <View
      className="gap-5 rounded-b-[48px] bg-surface-muted px-5 pb-8"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
            {formatToday()}
          </AppText>
          <AppText variant="heading" size="xl">
            {greeting}
          </AppText>
        </View>
        <IconButton
          symbol="calendar"
          fallback="📅"
          accessibilityLabel="Calendar: events, notes and planned meals"
          onPress={() => router.push('/calendar')}
          tone="surface"
        />
        <IconButton
          symbol="gearshape"
          fallback="⚙︎"
          accessibilityLabel="Settings and reminders"
          onPress={() => router.push('/settings')}
          tone="surface"
        />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name} is ${headline}${age.corrected ? ', adjusted age' : ''}. ${stageLine}. Tap to update details.`}
        onPress={() => router.push('/onboarding')}
        className="flex-row items-center gap-4 rounded-3xl border border-border bg-surface p-4 active:opacity-80"
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-sky">
          <AppText variant="heading" size="2xl" color="on-sky">
            {initial}
          </AppText>
        </View>
        <View className="flex-1 gap-0.5">
          <AppText variant="heading" size="lg">
            {name}
          </AppText>
          <AppText variant="label" color="primary">
            {headline}
          </AppText>
          <AppText variant="caption" size="sm">
            {stageLine}
          </AppText>
        </View>
        <AppText variant="heading" color="muted">
          ›
        </AppText>
      </Pressable>

      <Button label="Find a meal" size="compact" onPress={() => router.navigate('/mom')} />
    </View>
  );
}
