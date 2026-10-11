import { View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { fitsCookingTime } from '@/domain/recipes';
import { useHousehold } from '@/features/profile/use-household';
import { RecipeCard } from '@/features/recipes/recipe-card';
import { AppText, Notice, SymbolIcon } from '@/ui';

export type FavoritesListProps = {
  recipes: Recipe[];
  /** Hint shown when nothing is saved yet. */
  emptyHint?: string;
};

/** Saved recipes as a list, or a friendly empty state. */
export function FavoritesList({
  recipes,
  emptyHint = 'Tap the heart on any recipe to save it here.',
}: FavoritesListProps) {
  const household = useHousehold();
  return (
    <View className="gap-3 px-5">
      {recipes.length ? (
        recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} fitsTime={fitsCookingTime(r, household.cookingTime)} />
        ))
      ) : (
        <View className="items-center gap-3 py-12">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
            <SymbolIcon icon="heart" emoji="♡" size={36} />
          </View>
          <AppText variant="heading" className="text-center">
            No favorites yet
          </AppText>
          <AppText variant="caption" className="text-center">
            {emptyHint}
          </AppText>
        </View>
      )}
      {recipes.length ? <Notice body="Favorites are saved on this phone only." /> : null}
    </View>
  );
}
