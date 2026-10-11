import { View } from 'react-native';

import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { solidsArticles } from '@/content/solids-articles';
import { today } from '@/domain/dates';
import { pickDailyInsights } from '@/domain/insights';
import { todayRow } from '@/domain/library';
import { guideForMonths } from '@/domain/monthly-guides';
import { babyAge, babyStage } from '@/domain/stage';
import { stageLabels } from '@/domain/stage-labels';
import { InsightsRow } from '@/features/insights/insights-row';
import { useProfile } from '@/features/profile/profile-context';
import { MonthGuideCard } from '@/features/guides/month-guide-card';
import { AgeHero } from '@/features/today/age-hero';
import { Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  if (!profile) return null;

  const now = today();
  const stage = babyStage(profile, now);
  const daily = pickDailyInsights(insights, stage, profile.allergens, now);
  const ageMonths = babyAge(profile, now).months;
  const guide = guideForMonths(monthlyGuides, ageMonths);
  const row = todayRow(daily, solidsArticles, ageMonths);

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-8">
      <AgeHero profile={profile} />
      {guide ? (
        <View className="px-5">
          <MonthGuideCard guide={guide} focus={stageLabels[stage].focus} />
        </View>
      ) : null}
      <InsightsRow items={row} ageMonths={ageMonths} />
    </Screen>
  );
}
