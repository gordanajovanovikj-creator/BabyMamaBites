import { router } from 'expo-router';
import { Linking, View } from 'react-native';

import { chokingDisclaimer, safetyNotice } from '@/content/copy';
import { chokingGuide, solidsSourcesFor } from '@/content/solids-plan';
import { PageFooter } from '@/features/shared/page-footer';
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
          {emergency.body}
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

      <AppText color="muted">{chokingGuide.intro}</AppText>

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
        </Card>
      ))}

      <PageFooter sources={solidsSourcesFor(chokingGuide.groups.flatMap((g) => g.sources))}>
        <View className="gap-2">
          <AppText variant="caption" size="sm" className="font-bold">
            {chokingDisclaimer.title}
          </AppText>
          {chokingDisclaimer.body.split('\n\n').map((p) => (
            <AppText key={p} variant="caption" size="sm">
              {p}
            </AppText>
          ))}
        </View>
      </PageFooter>
    </Screen>
  );
}
