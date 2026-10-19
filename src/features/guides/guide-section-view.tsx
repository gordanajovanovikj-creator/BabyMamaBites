import { View } from 'react-native';

import type { GuideSection } from '@/content/monthly-guides';
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

/** One section of a monthly guide: text, bullets and a "guidance differs" note (sources close the page). */
export function GuideSectionView({ section }: { section: GuideSection }) {
  const urgent = section.id === 'when-to-call';
  const paragraphs = section.paragraphs.map((p) => p);

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
    </Card>
  );
}
