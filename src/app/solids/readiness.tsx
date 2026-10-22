import { useState } from 'react';
import { View } from 'react-native';

import { readiness, solidsSourcesFor } from '@/content/solids-plan';
import { libraryPhoto } from '@/features/library/library-photos';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { CheckRow } from '@/features/shopping/check-row';
import { PageFooter } from '@/features/shared/page-footer';
import { AppText, Card, Notice, Screen } from '@/ui';

/**
 * "Is your baby ready to start solids?": the readiness signs as a checklist, opened from the
 * Plan tab. The ticks are only a thinking aid for this visit, so they aren't saved.
 */
export default function ReadinessScreen() {
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set());
  const total = readiness.signs.length;
  const toggle = (i: number) =>
    setSeen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-0"
      overlay={<HeroTopBar title="Is your baby ready to start solids?" />}
    >
      <PictureHero
        tone="accent"
        icon="figure.seated.side"
        emoji="🪑"
        photo={libraryPhoto('ready')}
      />

      <DetailHeader
        kicker="Starting solids"
        title="Is your baby ready to start solids?"
        summary={readiness.intro}
      />

      <View className="gap-6 px-5 pt-6">
        <View className="gap-2">
          <AppText variant="label" accessibilityLiveRegion="polite">
            {`Tap the signs you've noticed · ${seen.size} of ${total}`}
          </AppText>
          <Card className="overflow-hidden p-0">
            {readiness.signs.map((sign, i) => (
              <CheckRow
                key={sign}
                text={sign}
                checked={seen.has(i)}
                onPress={() => toggle(i)}
                inCard
                last={i === total - 1}
              />
            ))}
          </Card>
          {seen.size === total ? (
            <AppText variant="caption">
              Your baby is showing the signs together. If you have questions about starting, your
              pediatrician can help.
            </AppText>
          ) : null}
        </View>

        <Notice
          tone="caution"
          title="Talk to your pediatrician"
          body="Ask about when to start, especially if your baby was born early. This is a summary of US guidance for general information, not medical advice."
        />
      </View>

      <PageFooter className="mx-5" sources={solidsSourcesFor(readiness.sources)} />
    </Screen>
  );
}
