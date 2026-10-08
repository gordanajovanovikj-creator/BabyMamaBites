import { Linking, View } from 'react-native';

import { splitReviewMarker } from '@/content/schemas';
import { chokingGuide, solidsAccessed, solidsSourcesFor } from '@/content/solids-plan';
import { SourceLinks } from '@/features/shared/source-links';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

function Bullets({ items, color }: { items: string[]; color?: 'danger' }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3">
          <AppText color={color ?? 'primary'} className="font-bold">
            •
          </AppText>
          <AppText color={color} className="flex-1">
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export default function ChokingScreen() {
  return (
    <Screen>
      <AppText color="muted">{splitReviewMarker(chokingGuide.intro).text}</AppText>

      <View accessibilityRole="alert" className="gap-3 rounded-3xl bg-danger-bg p-5">
        <AppText variant="heading" color="danger">
          Call 911 if your baby is choking and:
        </AppText>
        <Bullets items={chokingGuide.signs} color="danger" />
        <Button label="Call 911" onPress={() => Linking.openURL('tel:911').catch(() => {})} />
      </View>

      {chokingGuide.groups.map((g) => (
        <Card key={g.id} className="gap-3">
          <AppText variant="heading">{g.title}</AppText>
          <Bullets items={g.items} />
          <SourceLinks sources={solidsSourcesFor(g.sources)} />
        </Card>
      ))}

      <Notice
        tone="caution"
        title="Draft from official sources"
        body={`Summarized from CDC and AAP guidance read on ${solidsAccessed}. Not yet reviewed by a health professional, and not medical advice.`}
      />
    </Screen>
  );
}
