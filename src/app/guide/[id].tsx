import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { guideSourcesAccessed, monthlyGuides } from '@/content/monthly-guides';
import { splitReviewMarker } from '@/content/schemas';
import { adjacentGuides } from '@/domain/monthly-guides';
import { guidePhoto } from '@/features/guides/guide-photos';
import { GuideSectionView } from '@/features/guides/guide-section-view';
import { PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { AppText, Button, Notice, Screen } from '@/ui';

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guide = monthlyGuides.find((g) => g.id === id);

  if (!guide) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const { previous, next } = adjacentGuides(monthlyGuides, guide.id);

  return (
    // keyed so switching months starts at the top
    <Screen key={guide.id} padded={false} edgeToEdgeTop className="gap-0">
      <PictureHero tone="muted" icon="calendar" emoji="📅" photo={guidePhoto(guide.id)} />

      <DetailHeader
        kicker={guide.ageLabel}
        title={guide.title}
        summary={splitReviewMarker(guide.intro).text}
      />

      <View className="gap-6 px-5 pt-6">
        {guide.reviewStatus === 'placeholder' ? (
          <Notice
            tone="caution"
            title="Draft from official sources"
            body={`Summarized from US guidance (CDC, AAP, FDA and the HHS Office on Women's Health) read on ${guideSourcesAccessed}. Not yet reviewed by a health professional, and not medical advice. Always follow your own pediatrician's advice.`}
          />
        ) : null}

        {guide.sections.map((section) => (
          <GuideSectionView key={section.id} section={section} />
        ))}

        <View className="flex-row gap-3">
          {previous ? (
            <Button
              className="flex-1"
              variant="secondary"
              label={`‹ ${previous.title}`}
              accessibilityLabel={`Previous guide: ${previous.title}`}
              onPress={() => router.setParams({ id: previous.id })}
            />
          ) : null}
          {next ? (
            <Button
              className="flex-1"
              variant="secondary"
              label={`${next.title} ›`}
              accessibilityLabel={`Next guide: ${next.title}`}
              onPress={() => router.setParams({ id: next.id })}
            />
          ) : null}
        </View>
        <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
      </View>
    </Screen>
  );
}
