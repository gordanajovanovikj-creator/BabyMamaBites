import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getInsight } from '@/content/insights';
import { splitReviewMarker } from '@/content/schemas';
import { insightKindLabel } from '@/features/insights/insight-style';
import { libraryPhoto } from '@/features/library/library-photos';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { AppText, Button, Illustration, Notice, Screen } from '@/ui';

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
    <Screen padded={false} edgeToEdgeTop className="gap-0" overlay={<HeroTopBar />}>
      <PictureHero
        tone={insight.tone}
        icon={insight.icon}
        emoji={insight.emoji}
        photo={libraryPhoto(insight.id)}
        art={<Illustration name={insight.illustration} height={200} />}
      />

      <DetailHeader
        kicker={insightKindLabel[insight.kind]}
        title={insight.title}
        summary={splitReviewMarker(insight.summary).text}
      />

      <View className="gap-6 px-5 pt-6">
        <View className="gap-3">
          {insight.body.map((paragraph, i) => (
            <AppText key={i}>{splitReviewMarker(paragraph).text}</AppText>
          ))}
        </View>

        {insight.kind === 'when-to-call' ? (
          <Notice
            tone="urgent"
            title="If you're worried, reach out"
            body="Your doctor, OB-GYN or midwife is there to help. In an emergency, call 911."
          />
        ) : null}
        <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
        <HealthDisclaimerNote
          draftReviewer={insight.reviewStatus === 'placeholder' ? 'health professional' : undefined}
        />
      </View>
    </Screen>
  );
}
