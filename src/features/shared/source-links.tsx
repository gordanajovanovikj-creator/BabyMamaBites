import * as WebBrowser from 'expo-web-browser';
import { Pressable, View } from 'react-native';

import type { GuideSource } from '@/content/monthly-guides';
import { AppText } from '@/ui';

/** "Sources" list: each official page opens in an in-app browser. */
export function SourceLinks({ sources }: { sources: GuideSource[] }) {
  if (!sources.length) return null;
  return (
    <View className="gap-1 pt-1">
      <AppText variant="caption" size="sm" className="font-bold">
        Sources
      </AppText>
      {sources.map((s) => (
        <Pressable
          key={s.id}
          accessibilityRole="link"
          accessibilityLabel={`${s.publisher}: ${s.title}. Opens the official page.`}
          onPress={() => WebBrowser.openBrowserAsync(s.url)}
          hitSlop={6}
          className="min-h-11 justify-center active:opacity-60"
        >
          <AppText variant="caption" size="sm" className="underline">
            {s.publisher}: {s.title}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
