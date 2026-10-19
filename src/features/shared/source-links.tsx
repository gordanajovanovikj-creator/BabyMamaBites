import * as WebBrowser from 'expo-web-browser';
import { Fragment } from 'react';
import { Text } from 'react-native';

import type { GuideSource } from '@/content/monthly-guides';
import { AppText } from '@/ui';

/**
 * "Sources" as one compact, wrapping line of fine print (Sources: A · B · C); each
 * official page opens in an in-app browser.
 *
 * The label and links are plain nested `Text` that only add bold or an underline: they
 * inherit the paragraph's size, color and line height. Giving nested text its own size
 * class makes iOS misread the relative line height and spread the lines far apart.
 */
export function SourceLinks({ sources }: { sources: GuideSource[] }) {
  if (!sources.length) return null;
  return (
    <AppText variant="caption" size="sm">
      <Text className="font-bold">Sources: </Text>
      {sources.map((s, i) => (
        <Fragment key={s.id}>
          {i > 0 ? ' · ' : null}
          <Text
            accessibilityRole="link"
            accessibilityLabel={`${s.publisher}: ${s.title}. Opens the official page.`}
            onPress={() => WebBrowser.openBrowserAsync(s.url)}
            className="underline"
          >
            {`${s.publisher}: ${s.title}`}
          </Text>
        </Fragment>
      ))}
    </AppText>
  );
}
