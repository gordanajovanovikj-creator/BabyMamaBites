import { Linking, View } from 'react-native';

import type { ReactionAdvice } from '@/content/reactions';
import { splitReviewMarker } from '@/content/schemas';
import { solidsSourcesFor } from '@/content/solids-plan';
import { SourceLinks } from '@/features/shared/source-links';
import { AppText, Button, cn } from '@/ui';

export type ReactionAdviceViewProps = {
  advice: ReactionAdvice;
  urgent: boolean;
};

/** Escalation shown as soon as a reaction is chosen: who to call, never a diagnosis. */
export function ReactionAdviceView({ advice, urgent }: ReactionAdviceViewProps) {
  const color = urgent ? 'danger' : 'caution';
  return (
    <View
      accessibilityRole={urgent ? 'alert' : undefined}
      className={cn('gap-3 rounded-3xl p-5', urgent ? 'bg-danger-bg' : 'bg-caution-bg')}
    >
      <AppText variant="heading" color={color}>
        {advice.title}
      </AppText>
      <AppText color={color}>{splitReviewMarker(advice.intro).text}</AppText>
      {advice.signs.map((sign) => (
        <View key={sign} className="flex-row gap-3">
          <AppText color={color} className="font-bold">
            •
          </AppText>
          <AppText color={color} className="flex-1">
            {sign}
          </AppText>
        </View>
      ))}
      <AppText color={color} className="font-bold">
        {advice.action}
      </AppText>
      {urgent ? (
        <Button label="Call 911" onPress={() => Linking.openURL('tel:911').catch(() => {})} />
      ) : null}
      <SourceLinks sources={solidsSourcesFor(advice.sources)} />
    </View>
  );
}
