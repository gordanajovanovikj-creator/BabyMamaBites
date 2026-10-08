import * as WebBrowser from 'expo-web-browser';
import { Pressable, View } from 'react-native';

import { getGuideSource, type GuideSection } from '@/content/monthly-guides';
import { splitReviewMarker } from '@/content/schemas';
import { AppText, Card, Notice } from '@/ui';

function Bullets({ items, urgent }: { items: string[]; urgent: boolean }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3">
          <AppText color={urgent ? 'danger' : 'primary'} className="font-bold">
            •
          </AppText>
          <AppText color={urgent ? 'danger' : 'ink'} className="flex-1">
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

function Sources({ ids }: { ids: string[] }) {
  const sources = ids.map(getGuideSource).filter((s) => s !== undefined);
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

/** One section of a monthly guide: text, bullets, a "guidance differs" note and its sources. */
export function GuideSectionView({ section }: { section: GuideSection }) {
  const urgent = section.id === 'when-to-call';
  const paragraphs = section.paragraphs.map((p) => splitReviewMarker(p).text);

  return (
    <Card tone={urgent ? 'muted' : 'surface'} className="gap-3">
      <AppText variant="heading" color={urgent ? 'danger' : 'ink'}>
        {section.title}
      </AppText>
      {paragraphs.map((p) => (
        <AppText key={p}>{p}</AppText>
      ))}
      {section.bullets.length ? <Bullets items={section.bullets} urgent={urgent} /> : null}
      {section.note ? <Notice title="Where guidance differs" body={section.note} /> : null}
      <Sources ids={section.sources} />
    </Card>
  );
}
