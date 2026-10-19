import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getLegalDocument } from '@/content/legal';
import { AppText, Button, Screen } from '@/ui';

/** Terms of Use or Privacy Policy, opened from Settings and the subscription screen. */
export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const document = getLegalDocument(doc);

  if (!document) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen className="gap-6">
      <View className="gap-1">
        <AppText variant="title" accessibilityRole="header">
          {document.title}
        </AppText>
        <AppText variant="caption">Last updated {document.updated}</AppText>
      </View>
      <AppText>{document.intro}</AppText>
      {document.sections.map((section) => (
        <View key={section.heading} className="gap-2">
          <AppText variant="heading">{section.heading}</AppText>
          {section.paragraphs.map((p) => (
            <AppText key={p}>{p}</AppText>
          ))}
          {section.bullets.map((b) => (
            <View key={b} className="flex-row gap-3">
              <AppText color="primary" className="font-bold">
                •
              </AppText>
              <AppText className="flex-1">{b}</AppText>
            </View>
          ))}
        </View>
      ))}
    </Screen>
  );
}
