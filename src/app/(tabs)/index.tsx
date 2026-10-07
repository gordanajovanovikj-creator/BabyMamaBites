import { router } from 'expo-router';
import { View } from 'react-native';

import { getDisclaimer } from '@/content/copy';
import { today } from '@/domain/dates';
import { babyAge, babyStage, formatAge, solidsWeek } from '@/domain/stage';
import { stageLabels } from '@/domain/stage-labels';
import { useProfile } from '@/features/profile/profile-context';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  const general = getDisclaimer('general');
  if (!profile) return null;

  const now = today();
  const age = babyAge(profile, now);
  const stage = babyStage(profile, now);
  const week = stage === 'solids' ? solidsWeek(profile, now) : null;
  const label = stageLabels[stage];

  return (
    <Screen>
      <AppText variant="caption" className="pt-2 uppercase tracking-widest">
        Today
      </AppText>
      <AppText variant="display">Hello, mama</AppText>

      <Card tone="primary" className="gap-3">
        <AppText variant="caption" color="on-primary" className="opacity-90">
          Your baby is
        </AppText>
        <AppText variant="display" color="on-primary">
          {formatAge(age)}
        </AppText>
        {age.corrected ? (
          <AppText color="on-primary" className="text-base opacity-90">
            Adjusted age, counted from the due date
          </AppText>
        ) : null}
        <View className="mt-1 self-start rounded-full bg-surface px-4 py-1.5">
          <AppText variant="label" color="primary">
            {label.title}
            {week ? ` · Week ${week}` : ''}
          </AppText>
        </View>
      </Card>

      <Card className="gap-2">
        <AppText variant="heading">What this stage is about</AppText>
        <AppText>{label.focus}</AppText>
      </Card>

      {general ? <Notice title={general.title} body={general.body} /> : null}

      <View className="gap-2">
        <Button
          label="Update my details"
          variant="secondary"
          onPress={() => router.push('/onboarding')}
        />
        <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
      </View>
    </Screen>
  );
}
