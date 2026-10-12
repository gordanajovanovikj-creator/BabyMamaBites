import { View } from 'react-native';

import { medicalDisclaimer } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import { AppText, Screen } from '@/ui';

/** The full Medical and Health Information Disclaimer, linked from Settings, About and every health page. */
export default function DisclaimerScreen() {
  return (
    <Screen className="gap-6">
      <AppText variant="title" accessibilityRole="header">
        Medical and health information disclaimer
      </AppText>
      {medicalDisclaimer.map((block) => (
        <View key={block.id} className="gap-2">
          <AppText variant="heading">{block.title}</AppText>
          <AppText>{splitReviewMarker(block.body).text}</AppText>
        </View>
      ))}
    </Screen>
  );
}
