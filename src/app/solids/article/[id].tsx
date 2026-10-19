import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getArticle } from '@/content/solids-articles';
import { solidsSourcesFor } from '@/content/solids-plan';
import { ageRangeLabel } from '@/domain/articles';
import { helplinesIn } from '@/domain/helplines';
import { articleItem } from '@/domain/library';
import { noticesFor } from '@/domain/safety-notices';
import { libraryPhoto } from '@/features/library/library-photos';
import { ReadMore } from '@/features/library/read-more';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { HelplineButtons } from '@/features/shared/helpline-buttons';
import { SafetyNotices } from '@/features/shared/safety-notice';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { DetailHeader } from '@/features/shared/detail-header';
import { SourceLinks } from '@/features/shared/source-links';
import { AppText, Button, Card, Illustration, Screen } from '@/ui';

export default function ArticleScreen() {
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
              {section.bullets.map((b) => (
                <View key={b} className="flex-row gap-3">
                  <AppText color={urgent ? 'danger' : 'primary'} className="font-bold">
                    •
                  </AppText>
                  <AppText className="flex-1" color={textColor}>
                    {b}
                  </AppText>
                </View>
              ))}
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

        <SourceLinks sources={solidsSourcesFor(article.sources)} />
      </View>

      <ReadMore current={articleItem(article)} />

      {/* Fine print and the disclaimer always close the page. */}
      <View className="gap-4 px-5 pt-6">
        <SafetyNotices ids={notices.bottom} />
        <HealthDisclaimerNote short={notices.bottom.length > 0} />
      </View>
    </Screen>
  );
}
