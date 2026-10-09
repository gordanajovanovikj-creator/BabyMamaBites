import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { splitReviewMarker } from '@/content/schemas';
import { articlesAccessed, getArticle } from '@/content/solids-articles';
import { solidsSourcesFor } from '@/content/solids-plan';
import { ageRangeLabel } from '@/domain/articles';
import { PictureHero } from '@/features/recipes/picture-hero';
import { SourceLinks } from '@/features/shared/source-links';
import { AppText, Button, Notice, Screen } from '@/ui';

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

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-0">
      <PictureHero tone={article.tone} icon={article.icon} emoji={article.emoji} />

      <View className="gap-2 px-5 pt-8">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          {ageRangeLabel(article)} · {article.readMinutes} min read
        </AppText>
        <AppText variant="title">{article.title}</AppText>
        <AppText color="muted">{splitReviewMarker(article.summary).text}</AppText>
      </View>

      <View className="gap-6 px-5 pt-6">
        {article.reviewStatus === 'placeholder' ? (
          <Notice
            tone="caution"
            title="Draft from official sources"
            body={`Summarized from US guidance read on ${articlesAccessed}. Not yet reviewed by a ${article.reviewer}, and not medical advice. Follow your pediatrician's advice, and call 911 in an emergency.`}
          />
        ) : null}

        {article.sections.map((section) => (
          <View key={section.heading} className="gap-3">
            <AppText variant="heading" size="2xl">
              {section.heading}
            </AppText>
            {section.paragraphs.map((p) => (
              <AppText key={p}>{p}</AppText>
            ))}
            {section.bullets.map((b) => (
              <View key={b} className="flex-row gap-3">
                <AppText color="primary" className="font-bold">
                  •
                </AppText>
                <AppText className="flex-1">{b}</AppText>
              </View>
            ))}
          </View>
        ))}

        <SourceLinks sources={solidsSourcesFor(article.sources)} />
      </View>
    </Screen>
  );
}
