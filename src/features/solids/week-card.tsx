import { router } from 'expo-router';
import { View } from 'react-native';

import { getStageInfo, type PlanWeek } from '@/content/solids-plan';
import { splitReviewMarker } from '@/content/schemas';
import { AppText, Card } from '@/ui';

export type WeekCardProps = {
  week: PlanWeek;
  totalWeeks: number;
};

/** This week's plan at a glance; opens the full week. */
export function WeekCard({ week, totalWeeks }: WeekCardProps) {
  const stage = getStageInfo(week.stage);
  const focus = splitReviewMarker(week.focus[0]).text;

  return (
    <Card
      tone="accent"
      className="gap-3"
      onPress={() =>
        router.push({ pathname: '/solids/week/[n]', params: { n: String(week.week) } })
      }
      accessibilityLabel={`This week: week ${week.week} of ${totalWeeks}, ${week.title}. ${stage?.label ?? ''}. Opens the full week.`}
    >
      <AppText
        variant="caption"
        color="on-accent"
        size="xs"
        className="font-bold uppercase tracking-wider"
      >
        This week · Week {week.week} of {totalWeeks}
      </AppText>
      <AppText variant="title" color="on-accent" size="2xl">
        {week.title}
      </AppText>
      {stage ? (
        <View className="self-start rounded-full bg-surface px-3 py-1">
          <AppText variant="label" size="sm" className="font-bold">
            {stage.label}
          </AppText>
        </View>
      ) : null}
      <AppText color="on-accent">{focus}</AppText>
      <View className="gap-1">
        <AppText variant="label" color="on-accent" className="font-bold">
          Foods to try
        </AppText>
        <AppText color="on-accent">{week.tryFoods.join(' · ')}</AppText>
      </View>
      {week.allergen ? (
        <AppText variant="label" color="on-accent">
          New allergen this week:{' '}
          <AppText className="font-bold" color="on-accent">
            {week.allergen.label}
          </AppText>
        </AppText>
      ) : null}
      <View className="flex-row items-center justify-between rounded-full bg-surface px-5 py-3">
        <AppText variant="label" color="primary" className="font-bold">
          See the full week
        </AppText>
        <AppText variant="heading" color="primary">
          ›
        </AppText>
      </View>
    </Card>
  );
}
