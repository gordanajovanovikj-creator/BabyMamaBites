import { router } from 'expo-router';
import { View } from 'react-native';

import type { MonthlyGuide } from '@/content/monthly-guides';
import { AppText, Card } from '@/ui';

export type MonthGuideCardProps = {
  guide: MonthlyGuide;
  /** One-line description of the current stage. */
  focus: string;
};

/** "What this stage is about": opens the guide for the baby's current month. */
export function MonthGuideCard({ guide, focus }: MonthGuideCardProps) {
  return (
    <Card
      onPress={() => router.push({ pathname: '/guide/[id]', params: { id: guide.id } })}
      accessibilityLabel={`What this stage is about. ${focus} Opens the ${guide.title} guide.`}
      className="gap-3"
    >
      <AppText variant="caption" size="xs" className="font-bold uppercase tracking-wider">
        {guide.title} · {guide.ageLabel}
      </AppText>
      <AppText variant="heading">What this stage is about</AppText>
      <AppText>{focus}</AppText>
      <View className="flex-row items-center justify-between rounded-full bg-surface-muted px-5 py-3">
        <AppText variant="label" color="primary" className="font-bold">
          Read the {guide.title} guide
        </AppText>
        <AppText variant="heading" color="primary">
          ›
        </AppText>
      </View>
    </Card>
  );
}
