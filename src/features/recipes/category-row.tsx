import { Pressable, ScrollView, View } from 'react-native';

import type { RecipeCategory } from '@/content/recipes';
import { AppText, cn, SymbolIcon, toneBackground } from '@/ui';

export type CategoryRowProps = {
  categories: RecipeCategory[];
  /** Highlighted category; null highlights "All" when `showAll` is set. */
  selectedId?: string | null;
  onSelect(id: string | null): void;
  showAll?: boolean;
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

/** Horizontally scrolling round recipe category buttons. */
export function CategoryRow({
  categories,
  selectedId = null,
  onSelect,
  showAll = false,
}: CategoryRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3 px-5 py-1"
    >
      {showAll ? (
        <CategoryButton
          label="All"
          tone="surface"
          selected={selectedId === null}
          onPress={() => onSelect(null)}
        >
          <SymbolIcon icon="sparkles" emoji="✨" />
        </CategoryButton>
      ) : null}
      {categories.map((c) => (
        <CategoryButton
          key={c.id}
          label={c.label}
          tone={c.tone}
          selected={selectedId === c.id}
          onPress={() => onSelect(c.id)}
        >
          <SymbolIcon icon={c.icon} emoji={c.emoji} />
        </CategoryButton>
      ))}
    </ScrollView>
  );
}
