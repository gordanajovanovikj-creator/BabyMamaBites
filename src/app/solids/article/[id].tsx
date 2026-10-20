import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getArticle } from '@/content/solids-articles';
import { solidsSourcesFor } from '@/content/solids-plan';
import { ageRangeLabel } from '@/domain/articles';
import { helplinesIn } from '@/domain/helplines';
import { articleItem } from '@/domain/library';
import { noticesFor } from '@/domain/safety-notices';
import { isFreeLibraryCategory } from '@/domain/subscription';
import { libraryPhoto } from '@/features/library/library-photos';
import { ReadMore } from '@/features/library/read-more';
import { PageFooter } from '@/features/shared/page-footer';
import { HelplineButtons } from '@/features/shared/helpline-buttons';
import { SafetyNotices } from '@/features/shared/safety-notice';
import { PremiumGate } from '@/features/subscription/premium-gate';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { AppText, BulletList, Button, Card, Illustration, Screen } from '@/ui';

function ArticleScreenBody() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticle(id);

  if (!article) {
    return (
      <Screen>
        <AppText variant="title">Article not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const notices = noticesFor(article);

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-0"
      overlay={<HeroTopBar title={article.title} />}
    >
      <PictureHero
        tone={article.tone}
        icon={article.icon}
        emoji={article.emoji}
        photo={libraryPhoto(article.id)}
        art={
          <Illustration
            name={article.illustration}
            height={200}
            on={article.tone === 'surface' ? 'white' : article.tone === 'deep' ? 'dark' : 'pastel'}
          />
        }
      />

      <DetailHeader
        kicker={`${ageRangeLabel(article)} · ${article.readMinutes} min read`}
        title={article.title}
        summary={article.summary}
      />

      <View className="gap-6 px-5 pt-6">
        <SafetyNotices ids={notices.top} />
        {article.keyPoints ? (
          <Card tone="muted" className="gap-3">
            <AppText variant="label" size="sm" color="primary" className="font-bold uppercase">
              In short
            </AppText>
            {article.keyPoints.map((point) => (
              <View key={point} className="flex-row gap-3">
                <AppText color="primary" className="font-bold">
                  ✓
                </AppText>
                <AppText className="flex-1 font-semibold">{point}</AppText>
              </View>
            ))}
          </Card>
        ) : null}
        {article.sections.map((section) => {
          const urgent = section.callout === 'urgent';
          const textColor = urgent ? 'danger' : undefined;
          const body = (
            <>
              <AppText variant="heading" size="2xl" color={textColor}>
                {urgent ? `⚠️ ${section.heading}` : section.heading}
              </AppText>
              {section.paragraphs.map((p) => (
                <AppText key={p} color={textColor}>
                  {p}
                </AppText>
              ))}
              {section.bullets.length ? (
                <BulletList items={section.bullets} color={textColor} />
              ) : null}
            </>
          );
          if (!section.callout) {
            return (
              <View key={section.heading} className="gap-3">
                {body}
              </View>
            );
          }
          const found = helplinesIn([...section.paragraphs, ...section.bullets].join(' '));
          // Support callouts lead with the crisis and maternal mental health lines; 911 stays last.
          const lines = urgent
            ? found
            : [...found.filter((l) => l !== '911'), ...found.filter((l) => l === '911')];
          return (
            <Card
              key={section.heading}
              tone={urgent ? 'danger' : 'sky'}
              className="gap-3"
              accessibilityRole={urgent ? 'alert' : undefined}
            >
              {body}
              <HelplineButtons lines={lines} />
            </Card>
          );
        })}
        <SafetyNotices ids={notices.afterBody} />
      </View>

      <ReadMore current={articleItem(article)} />

      {/* Sources, fine print and the disclaimer always close the page. */}
      <PageFooter
        className="mx-5"
        sources={solidsSourcesFor(article.sources)}
        notices={notices.bottom}
      />
    </Screen>
  );
}

/** Safety and wellbeing articles are free; the rest of the library is part of Premium. */
export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getArticle(id);
  return (
    <PremiumGate feature="library" free={!item || isFreeLibraryCategory(item.category)}>
      <ArticleScreenBody />
    </PremiumGate>
  );
}
