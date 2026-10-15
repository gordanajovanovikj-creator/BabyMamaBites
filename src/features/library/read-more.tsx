import { insightCategories } from '@/content/insight-categories';
import { relatedItems, type LibraryItem } from '@/domain/library';

import { LibraryCarousel } from './library-carousel';
import { useLibrary } from './use-library';

/** "Read more" row at the end of an article or tip: related reads, same topic first. */
export function ReadMore({
  current,
}: {
  current: Pick<LibraryItem, 'id' | 'source' | 'category' | 'fromMonths' | 'toMonths'>;
}) {
  const { items, ageMonths } = useLibrary();
  const related = relatedItems(current, items, ageMonths);
  if (!related.length) return null;
  const topic = insightCategories.find((c) => c.id === current.category)?.label;
  return (
    <LibraryCarousel
      title="Read more"
      subtitle={topic ? `More on ${topic.toLowerCase()} and related topics` : undefined}
      items={related}
      ageMonths={ageMonths}
    />
  );
}
