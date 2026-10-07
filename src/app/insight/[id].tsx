import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getInsight } from '@/content/insights';
import { insightKindLabel } from '@/features/insights/insight-style';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

export default function InsightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insight = getInsight(id);

  if (!insight) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="gap-2">
        <AppText variant="caption" className="font-semibold uppercase tracking-wider">
          {insightKindLabel[insight.kind]}
        </AppText>
        <AppText variant="title">{insight.title}</AppText>
        <AppText variant="body" color="muted">
          {insight.summary}
        </AppText>
      </View>
      {insight.reviewStatus === 'placeholder' ? (
        <View className="self-start rounded-full bg-accent px-3 py-1">
          <AppText variant="label" color="on-accent" className="text-sm">
            Draft · awaiting expert review
          </AppText>
        </View>
      ) : null}
      <Card className="gap-4">
        {insight.body.map((paragraph, i) => (
          <AppText key={i}>{paragraph}</AppText>
        ))}
      </Card>
      {insight.kind === 'when-to-call' ? (
        <Notice
          tone="urgent"
          title="If you're worried, reach out"
          body="Your doctor, midwife or health visitor is there to help. In an emergency, call your local emergency number."
        />
      ) : null}
      <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
    </Screen>
  );
}
