import { Pressable, ScrollView, View } from 'react-native';

import type { RecipeCategory } from '@/content/recipes';
import { AppText, cn, SymbolIcon, toneBackground } from '@/ui';

export type CategoryRowProps = {
  categories: RecipeCategory[];
  selectedId: string | null;
  onSelect(id: string | null): void;
};

function CategoryButton({
  label,
  selected,
  onPress,
  children,
  tone,
}: {
  label: string;
  selected: boolean;
  onPress(): void;
  children: React.ReactNode;
  tone: RecipeCategory['tone'];
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label} recipes`}
      onPress={onPress}
      className="w-20 items-center gap-2 active:opacity-70"
    >
      <View
        className={cn(
          'h-[72px] w-[72px] items-center justify-center rounded-full border-[3px]',
          toneBackground(tone),
          selected ? 'border-primary' : 'border-transparent',
        )}
      >
        {children}
      </View>
      <AppText
        variant="label"
        size="xs"
        color={selected ? 'primary' : 'ink'}
        className="text-center font-bold"
        numberOfLines={2}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

/** Horizontally scrolling recipe categories, with "All" first. Tap again to clear. */
export function CategoryRow({ categories, selectedId, onSelect }: CategoryRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-5 py-1"
    >
      <CategoryButton
        label="All"
        tone="surface"
        selected={selectedId === null}
        onPress={() => onSelect(null)}
      >
        <SymbolIcon icon="sparkles" emoji="✨" />
      </CategoryButton>
      {categories.map((c) => (
        <CategoryButton
          key={c.id}
          label={c.label}
          tone={c.tone}
          selected={selectedId === c.id}
          onPress={() => onSelect(selectedId === c.id ? null : c.id)}
        >
          <SymbolIcon icon={c.icon} emoji={c.emoji} />
        </CategoryButton>
      ))}
    </ScrollView>
  );
}
