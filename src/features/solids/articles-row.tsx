import { router } from 'expo-router';

import { getInsightCategory } from '@/content/insight-categories';
import { articlesForAge } from '@/domain/articles';
import { LibraryCarousel } from '@/features/library/library-carousel';
import { useLibrary } from '@/features/library/use-library';

/** "Insights" on the Plan tab: baby articles and tips, the ones for the baby's age first. */
export function ArticlesRow() {
  const { items, ageMonths } = useLibrary();
  const baby = items.filter((i) => getInsightCategory(i.category)?.audience === 'baby');
  return (
    <LibraryCarousel
      title="Insights"
      subtitle="Picked for your baby's age"
      items={articlesForAge(baby, ageMonths).slice(0, 10)}
      ageMonths={ageMonths}
      onSeeAll={() => router.push('/insights')}
    />
  );
}
