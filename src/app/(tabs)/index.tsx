import { View } from 'react-native';

import { insights } from '@/content/insights';
import { today } from '@/domain/dates';
import { pickDailyInsights } from '@/domain/insights';
import { babyStage } from '@/domain/stage';
import { stageLabels } from '@/domain/stage-labels';
import { InsightsRow } from '@/features/insights/insights-row';
import { useProfile } from '@/features/profile/profile-context';
import { AgeHero } from '@/features/today/age-hero';
import { AppText, Card, Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  if (!profile) return null;

  const now = today();
  const stage = babyStage(profile, now);
  const daily = pickDailyInsights(insights, stage, profile.allergens, now);

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-8">
      <AgeHero profile={profile} />
      <InsightsRow insights={daily} />
      <View className="px-5">
        <Card className="gap-2">
          <AppText variant="heading">What this stage is about</AppText>
          <AppText>{stageLabels[stage].focus}</AppText>
        </Card>
      </View>
    </Screen>
  );
}
