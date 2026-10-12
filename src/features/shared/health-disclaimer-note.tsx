import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { articleDisclaimerNote } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import { AppText } from '@/ui';

/** Short italic disclaimer at the bottom of health-related pages, with a link to the full text. */
export function HealthDisclaimerNote() {
  return (
    <View className="gap-1 border-t border-border pt-4">
      <AppText variant="caption" size="sm" className="italic">
        <AppText variant="caption" size="sm" className="font-bold italic">
          {articleDisclaimerNote.title}:{' '}
        </AppText>
        {splitReviewMarker(articleDisclaimerNote.body).text}
      </AppText>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Read the full medical disclaimer"
        onPress={() => router.push('/disclaimer')}
        hitSlop={8}
        className="min-h-11 justify-center self-start active:opacity-60"
      >
        <AppText variant="label" size="sm" color="primary" className="font-bold">
          Read the full disclaimer ›
        </AppText>
      </Pressable>
    </View>
  );
}
