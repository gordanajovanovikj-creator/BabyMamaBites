import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { monthlyGuides } from '@/content/monthly-guides';
import { adjacentGuides } from '@/domain/monthly-guides';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

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
        <AppText color="muted">{guide.intro}</AppText>
      </View>

      {guide.reviewStatus === 'placeholder' ? (
        <View className="self-start rounded-full bg-accent px-3 py-1">
          <AppText variant="label" color="on-accent" size="sm">
            Draft · awaiting expert review
          </AppText>
        </View>
      ) : null}

      {guide.sections.map((section) =>
        section.id === 'when-to-call' ? (
          <Notice key={section.id} tone="urgent" title={section.title} body={section.body} />
        ) : (
          <Card key={section.id} className="gap-2">
            <AppText variant="heading">{section.title}</AppText>
            <AppText>{section.body}</AppText>
          </Card>
        ),
      )}

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
