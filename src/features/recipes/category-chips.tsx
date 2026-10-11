import { ScrollView } from 'react-native';

import type { RecipeCategory } from '@/content/recipes';
import { Chip } from '@/ui';

export type CategoryChipsProps = {
  categories: RecipeCategory[];
  /** Selected category, or null for "All". */
  selectedId: string | null;
  onSelect(id: string | null): void;
};

/** "All" plus one filter chip per recipe category, as on the Insights tab. */
export function CategoryChips({ categories, selectedId, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5 pb-5 pt-2"
    >
      <Chip borderless label="All" selected={selectedId === null} onPress={() => onSelect(null)} />
      {categories.map((c) => (
        <Chip
          borderless
          key={c.id}
          label={`${c.emoji} ${c.label}`}
          selected={selectedId === c.id}
          onPress={() => onSelect(c.id)}
        />
      ))}
    </ScrollView>
  );
}
