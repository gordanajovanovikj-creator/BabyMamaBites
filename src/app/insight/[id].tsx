import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getInsight } from '@/content/insights';
import { insightBlocks, type InsightBlock } from '@/domain/insights';
import { insightItem } from '@/domain/library';
import { noticesFor } from '@/domain/safety-notices';
import { insightKindLabel } from '@/features/insights/insight-style';
import { libraryPhoto } from '@/features/library/library-photos';
import { ReadMore } from '@/features/library/read-more';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { PageFooter } from '@/features/shared/page-footer';
import { HelplineButtons } from '@/features/shared/helpline-buttons';
import { SafetyNotices } from '@/features/shared/safety-notice';
import { AppText, Button, Illustration, Notice, Screen } from '@/ui';

/** One line of an insight: a heading, a bullet, a numbered step or a paragraph. */
function BodyBlock({ block, first }: { block: InsightBlock; first: boolean }) {
  switch (block.kind) {
    case 'heading':
      return (
        <AppText variant="heading" size="2xl" className={first ? undefined : 'pt-3'}>
          {block.text}
        </AppText>
      );
    case 'bullet':
      return (
        <View className="flex-row gap-3">
          <AppText color="primary" className="font-bold">
            •
          </AppText>
          <AppText className="flex-1">{block.text}</AppText>
        </View>
      );
    case 'step':
      return (
        <View className="flex-row gap-3">
          <AppText className="w-6 font-bold">{`${block.number}.`}</AppText>
          <AppText className="flex-1">{block.text}</AppText>
        </View>
      );
    default:
      return <AppText>{block.text}</AppText>;
  }
}

export default function InsightScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insight = getInsight(id);

  if (!insight) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const notices = noticesFor(insight);

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-0"
      overlay={<HeroTopBar title={insight.title} />}
    >
      <PictureHero
        tone={insight.tone}
        icon={insight.icon}
        emoji={insight.emoji}
        photo={libraryPhoto(insight.id)}
        art={<Illustration name={insight.illustration} height={200} />}
      />

      <DetailHeader
        kicker={insightKindLabel[insight.kind]}
        title={insight.title}
        summary={insight.summary}
      />

      <View className="gap-6 px-5 pt-6">
        <SafetyNotices ids={notices.top} />
        <View className="gap-3">
          {insightBlocks(insight.body.map((line) => line)).map((block, i) => (
            <BodyBlock key={i} block={block} first={i === 0} />
          ))}
        </View>

        {insight.kind === 'when-to-call' ? (
          <Notice
            tone="urgent"
            title="If you're worried, reach out"
            body="Your doctor, OB-GYN or midwife is there to help. In an emergency, call 911."
          />
        ) : null}
        {insight.kind === 'when-to-call' ? <HelplineButtons lines={['911']} /> : null}
        <Button label="About & safety" variant="quiet" onPress={() => router.push('/about')} />
      </View>

      <ReadMore current={insightItem(insight)} />

      {/* Fine print and the disclaimer always close the page. */}
      <PageFooter className="mx-5" notices={notices.bottom} />
    </Screen>
  );
}
