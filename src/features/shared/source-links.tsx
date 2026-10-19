import * as WebBrowser from 'expo-web-browser';
import { Fragment } from 'react';

import type { GuideSource } from '@/content/monthly-guides';
import { AppText } from '@/ui';

/**
 * "Sources" as one compact, wrapping line of fine print (Sources: A · B · C); each
 * official page opens in an in-app browser.
 */
export function SourceLinks({ sources }: { sources: GuideSource[] }) {
  if (!sources.length) return null;
  return (
    <AppText variant="caption" size="sm" className="leading-6">
      <AppText variant="caption" size="sm" className="font-bold">
        Sources:{' '}
      </AppText>
      {sources.map((s, i) => (
        <Fragment key={s.id}>
          {i > 0 ? ' · ' : null}
          <AppText
            variant="caption"
            size="sm"
            accessibilityRole="link"
            accessibilityLabel={`${s.publisher}: ${s.title}. Opens the official page.`}
            onPress={() => WebBrowser.openBrowserAsync(s.url)}
            suppressHighlighting={false}
            className="underline"
          >
            {s.publisher}: {s.title}
          </AppText>
        </Fragment>
      ))}
    </AppText>
  );
}
