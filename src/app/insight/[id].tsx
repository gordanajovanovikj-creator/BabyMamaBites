import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getInsight } from '@/content/insights';
import { splitReviewMarker } from '@/content/schemas';
import { insightKindLabel } from '@/features/insights/insight-style';
import { libraryPhoto } from '@/features/library/library-photos';
import { HeroPhoto } from '@/features/shared/hero-photo';
import { AppText, Button, Card, Illustration, Notice, Screen } from '@/ui';

export default function InsightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insight = getInsight(id);
  const photo = insight ? libraryPhoto(insight.id) : undefined;

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
      {photo ? (
        <HeroPhoto source={photo} />
      ) : (
        <View className="items-center">
          <Illustration name={insight.illustration} height={160} />
        </View>
      )}
      <View className="gap-2">
        <AppText variant="caption" className="font-semibold uppercase tracking-wider">
          {insightKindLabel[insight.kind]}
        </AppText>
        <AppText variant="title">{insight.title}</AppText>
        <AppText variant="body" color="muted">
          {splitReviewMarker(insight.summary).text}
        </AppText>
      </View>
      {insight.reviewStatus === 'placeholder' ? (
        <View className="self-start rounded-full bg-accent px-3 py-1">
          <AppText variant="label" color="on-accent" size="sm">
            Draft · awaiting expert review
          </AppText>
        </View>
      ) : null}
      <Card className="gap-4">
        {insight.body.map((paragraph, i) => (
          <AppText key={i}>{splitReviewMarker(paragraph).text}</AppText>
        ))}
      </Card>
      {insight.kind === 'when-to-call' ? (
        <Notice
          tone="urgent"
          title="If you're worried, reach out"
          body="Your doctor, OB-GYN or midwife is there to help. In an emergency, call 911."
        />
      ) : null}
      <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
    </Screen>
  );
}
