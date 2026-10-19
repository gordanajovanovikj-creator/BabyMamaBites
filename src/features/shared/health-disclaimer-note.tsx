import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { articleDisclaimerNote } from '@/content/copy';
import { AppText } from '@/ui';

export type HealthDisclaimerNoteProps = {
  /**
   * Leave out the general disclaimer text (keeping the link) when the
   * page already ends with a more specific safety notice, so it never shows two.
   */
  short?: boolean;
};

/**
 * Short italic disclaimer at the bottom of health-related pages, with a link to
 * the full text.
 */
export function HealthDisclaimerNote({ short = false }: HealthDisclaimerNoteProps) {
  return (
    <View className="gap-2">
      {short ? null : (
        <AppText variant="caption" size="sm" className="italic">
          <Text className="font-bold">{`${articleDisclaimerNote.title}: `}</Text>
          {articleDisclaimerNote.body}
        </AppText>
      )}
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
