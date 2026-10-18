import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { chokingDisclaimer, safetyNotice } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import { chokingGuide, solidsSourcesFor } from '@/content/solids-plan';
import { SourceLinks } from '@/features/shared/source-links';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { AppText, Button, Card, Screen } from '@/ui';

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
  const emergency = safetyNotice('choking-emergency');
  return (
    <Screen>
      {/* The emergency comes first, before anything to read. */}
      <View accessibilityRole="alert" className="gap-3 rounded-3xl bg-danger-bg p-5">
        <AppText variant="heading" color="danger">
          {`⚠️ ${emergency.title}`}
        </AppText>
        <AppText color="danger" className="font-semibold">
          {splitReviewMarker(emergency.body).text}
        </AppText>
        <AppText variant="label" color="danger">
          Call 911 if your baby is choking and:
        </AppText>
        <Bullets items={chokingGuide.signs} color="danger" />
        <Button label="Call 911" onPress={() => Linking.openURL('tel:911').catch(() => {})} />
        <Button
          label="Emergency & resources"
          variant="quiet"
          onPress={() => router.push('/emergency')}
        />
      </View>

      <AppText color="muted">{splitReviewMarker(chokingGuide.intro).text}</AppText>

      <Button
        label="Read: Choking vs. gagging guide"
        variant="secondary"
        accessibilityLabel="Read the choking vs. gagging guide, with first aid steps"
        onPress={() =>
          router.push({ pathname: '/solids/article/[id]', params: { id: 'gagging-vs-choking' } })
        }
      />

      {chokingGuide.groups.map((g) => (
        <Card key={g.id} className="gap-3">
          <AppText variant="heading">{g.title}</AppText>
          <Bullets items={g.items} />
          <SourceLinks sources={solidsSourcesFor(g.sources)} />
        </Card>
      ))}

      <View className="gap-2 pt-2">
        <AppText variant="heading">{chokingDisclaimer.title}</AppText>
        {splitReviewMarker(chokingDisclaimer.body)
          .text.split('\n\n')
          .map((p) => (
            <AppText key={p} variant="caption">
              {p}
            </AppText>
          ))}
      </View>
      <HealthDisclaimerNote draftReviewer="health professional" />
    </Screen>
  );
}
