import { View } from 'react-native';

import { readiness, solidsSourcesFor } from '@/content/solids-plan';
import { libraryPhoto } from '@/features/library/library-photos';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { PageFooter } from '@/features/shared/page-footer';
import { BulletList, Notice, Screen } from '@/ui';

/** "Is your baby ready to start solids?": the readiness signs, opened from the Plan tab. */
export default function ReadinessScreen() {
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
        <BulletList items={readiness.signs} />

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
