import { View } from 'react-native';

import { solidsArticles } from '@/content/solids-articles';
import { today } from '@/domain/dates';
import { articlesForAge, articleTiming, type ArticleTiming } from '@/domain/articles';
import { babyAge } from '@/domain/stage';
import { useProfile } from '@/features/profile/profile-context';
import { ArticleRow } from '@/features/solids/article-row';
import { AppText, Screen } from '@/ui';

const groups: { timing: ArticleTiming; title: string }[] = [
  { timing: 'now', title: 'For now' },
  { timing: 'coming-up', title: 'Coming up' },
  { timing: 'earlier', title: 'Earlier' },
];

export default function ArticlesScreen() {
  const { profile } = useProfile();
  const ageMonths = profile ? babyAge(profile, today()).months : 0;
  const ordered = articlesForAge(solidsArticles, ageMonths);

  return (
    <Screen>
      {groups.map((g) => {
        const items = ordered.filter((a) => articleTiming(a, ageMonths) === g.timing);
        if (!items.length) return null;
        return (
          <View key={g.timing} className="gap-1">
            <AppText variant="heading" size="2xl" className="pb-1">
              {g.title}
            </AppText>
            {items.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
          </View>
        );
      })}
    </Screen>
  );
}
