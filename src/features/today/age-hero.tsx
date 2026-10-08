import { router } from 'expo-router';
import { View } from 'react-native';
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

/** Top of Today: date header, then the baby's age big and centred with one action. */
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

  return (
    <View className="rounded-b-[48px] bg-surface px-5 pb-10" style={{ paddingTop: insets.top + 8 }}>
      <View className="flex-row items-center justify-between">
        <IconButton
          symbol="person.crop.circle"
          fallback="Me"
          accessibilityLabel="Update my details"
          onPress={() => router.push('/onboarding')}
        />
        <AppText variant="label" size="lg">
          {formatToday()}
        </AppText>
        <IconButton
          symbol="info.circle"
          fallback="i"
          accessibilityLabel="About and safety"
          onPress={() => router.push('/about')}
        />
      </View>

      <View
        className="items-center gap-2 pb-6 pt-14"
        accessible
        accessibilityLabel={`${name} is ${headline}${age.corrected ? ', adjusted age' : ''}. ${stageLine}.`}
      >
        <AppText variant="heading" color="primary" size="2xl" className="text-center">
          {name}
        </AppText>
        <AppText variant="display" color="primary" className="text-center">
          {headline}
        </AppText>
        <AppText variant="caption" className="text-center">
          {stageLine}
        </AppText>
      </View>

      <Button label="Find a meal" size="compact" onPress={() => router.navigate('/recipes')} />
    </View>
  );
}
