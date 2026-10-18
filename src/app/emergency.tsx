import { Linking, Pressable, View } from 'react-native';

import { emergencyResources } from '@/content/emergency-resources';
import { splitReviewMarker } from '@/content/schemas';
import { HelplineButtons } from '@/features/shared/helpline-buttons';
import { AppText, Card, Screen } from '@/ui';

/**
 * Emergency & resources: 911, Poison Control, crisis and maternal support lines with
 * one-tap call buttons, then trusted sites. Reachable from Settings, About, the choking
 * guide and allergy articles.
 */
export default function EmergencyScreen() {
  const { intro, groups, resources } = emergencyResources;
  return (
    <Screen>
      <AppText color="muted">{splitReviewMarker(intro).text}</AppText>

      {groups.map((g) => (
        <Card
          key={g.id}
          tone={g.urgent ? 'danger' : 'muted'}
          className="gap-2"
          accessibilityRole={g.urgent ? 'alert' : undefined}
        >
          <AppText variant="heading" color={g.urgent ? 'danger' : undefined}>
            {g.title}
          </AppText>
          <AppText color={g.urgent ? 'danger' : undefined}>{g.body}</AppText>
          <HelplineButtons lines={g.lines} />
        </Card>
      ))}

      <View className="gap-2 pt-2">
        <AppText variant="heading" size="2xl" accessibilityRole="header">
          Trusted resources
        </AppText>
        {resources.map((r) => (
          <Pressable
            key={r.url}
            accessibilityRole="link"
            accessibilityLabel={`${r.label}. ${r.detail}. Opens in your browser.`}
            onPress={() => Linking.openURL(r.url).catch(() => {})}
            className="min-h-14 flex-row items-center gap-3 border-b border-border py-3 active:opacity-70"
          >
            <View className="flex-1 gap-0.5">
              <AppText variant="label" color="primary" className="font-bold">
                {r.label}
              </AppText>
              <AppText variant="caption" size="sm">
                {r.detail}
              </AppText>
            </View>
            <AppText color="muted">↗</AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
