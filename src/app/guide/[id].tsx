import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { guideSourcesAccessed, monthlyGuides } from '@/content/monthly-guides';
import { splitReviewMarker } from '@/content/schemas';
import { adjacentGuides } from '@/domain/monthly-guides';
import { GuideSectionView } from '@/features/guides/guide-section-view';
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
    <Screen key={guide.id}>
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          {guide.ageLabel}
        </AppText>
        <AppText variant="title">{guide.title}</AppText>
        <AppText color="muted">{splitReviewMarker(guide.intro).text}</AppText>
      </View>

      {guide.reviewStatus === 'placeholder' ? (
        <View className="self-start rounded-full bg-accent px-3 py-1">
          <AppText variant="label" color="on-accent" size="sm">
            Draft · awaiting expert review
          </AppText>
        </View>
      ) : null}

      {guide.reviewStatus === 'placeholder' ? (
        <Notice
          tone="caution"
          title="Draft from official sources"
          body={`Summarised from CDC, NHS, AAP and WHO guidance (read ${guideSourcesAccessed}). Not yet reviewed by a health professional, and not medical advice. Always follow your own doctor's advice.`}
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
    </Screen>
  );
}
