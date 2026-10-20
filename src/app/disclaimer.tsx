import { router } from 'expo-router';
import { View } from 'react-native';

import { medicalDisclaimer, safetyNotice } from '@/content/copy';
import { AppText, Button, Screen } from '@/ui';

/** Safety notes repeated here so every disclaimer is in one place. */
const extraNotes = ['feeding-safety', 'maternal-health', 'family-nutrition', 'our-guidance'];

/**
 * Disclaimers & terms: the full Medical and Health Information Disclaimer, the safety
 * notes shown on content pages, and links to the Terms, Privacy Policy and emergency help.
 * Linked from Settings, About and every health page.
 */
export default function DisclaimerScreen() {
  return (
    <Screen className="gap-6">
      <AppText variant="title" accessibilityRole="header">
        Medical and health information disclaimer
      </AppText>
      {[...medicalDisclaimer, ...extraNotes.map(safetyNotice)].map((block) => (
        <View key={block.id} className="gap-2">
          <AppText variant="heading">{block.title}</AppText>
          <AppText>{block.body}</AppText>
        </View>
      ))}
      <View className="gap-3">
        <Button label="Emergency & resources" onPress={() => router.push('/emergency')} />
        <Button
          label="Terms of Use"
          variant="secondary"
          onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'terms' } })}
        />
        <Button
          label="Privacy Policy"
          variant="secondary"
          onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacy' } })}
        />
      </View>
    </Screen>
  );
}
