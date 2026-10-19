import { router } from 'expo-router';
import { View } from 'react-native';

import { getStageInfo, type PlanWeek } from '@/content/solids-plan';
import { splitReviewMarker } from '@/content/schemas';
import { tryFoodsHeading } from '@/domain/food-log';
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
      className="gap-3"
      onPress={() =>
        router.push({ pathname: '/solids/week/[n]', params: { n: String(week.week) } })
      }
      accessibilityLabel={`This week: week ${week.week} of ${totalWeeks}, ${week.title}. ${stage?.label ?? ''}. Opens the full week.`}
    >
      <AppText
        variant="caption"
        color="primary"
        size="xs"
        className="font-bold uppercase tracking-wider"
      >
        This week · Week {week.week} of {totalWeeks}
      </AppText>
      <AppText variant="title" size="2xl">
        {week.title}
      </AppText>
      {stage ? (
        <View className="self-start rounded-full bg-sky px-3 py-1">
          <AppText variant="label" size="sm" color="on-sky" className="font-bold">
            {stage.label}
          </AppText>
        </View>
      ) : null}
      <AppText>{focus}</AppText>
      <View className="gap-1">
        <AppText variant="label" className="font-bold">
          {tryFoodsHeading(week.week).title}
        </AppText>
        <AppText>{week.tryFoods.join(' · ')}</AppText>
      </View>
      {week.allergen ? (
        <AppText variant="label">
          New allergen this week: <AppText className="font-bold">{week.allergen.label}</AppText>
        </AppText>
      ) : null}
      <View className="flex-row items-center justify-between rounded-full bg-surface-muted px-5 py-3">
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
