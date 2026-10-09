import { useWindowDimensions, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { AppText } from '@/ui';

import { RecipeTile } from './recipe-tile';

const GAP = 12;
const SIDE = 20;

export type RecipeGridProps = {
  title: string;
  subtitle?: string;
  recipes: Recipe[];
};

/** A filtered category: heading, then every recipe in a two-column grid. */
export function RecipeGrid({ title, subtitle, recipes }: RecipeGridProps) {
  const { width } = useWindowDimensions();
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);

  return (
    <View className="gap-4 px-5">
      <View className="gap-1">
        <AppText variant="heading" size="2xl">
          {title}
        </AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
      <View className="flex-row flex-wrap" style={{ gap: GAP }}>
        {recipes.map((r) => (
          <RecipeTile key={r.id} recipe={r} width={cell} />
        ))}
      </View>
    </View>
  );
}
