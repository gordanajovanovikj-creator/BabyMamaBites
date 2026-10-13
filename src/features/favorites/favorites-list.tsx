import { useWindowDimensions, View } from 'react-native';

import type { Food } from '@/content/foods';

import type { Recipe } from '@/content/recipes';
import { foodTriedOn } from '@/domain/foods';
import { fitsCookingTime } from '@/domain/recipes';
import { FoodCard } from '@/features/foods/food-card';
import { useHousehold } from '@/features/profile/use-household';
import { useFoodLog } from '@/features/solids/food-log-context';
import { RecipeCard } from '@/features/recipes/recipe-card';
import { AppText, Notice, SymbolIcon } from '@/ui';

export type FavoritesListProps = {
  recipes: Recipe[];
  /** Saved single foods from the food guide (Baby tab only). */
  foods?: Food[];
  /** Hint shown when nothing is saved yet. */
  emptyHint?: string;
};

const GAP = 12;
const SIDE = 20;

/** Saved recipes (and single foods) as a list, or a friendly empty state. */
export function FavoritesList({
  recipes,
  foods = [],
  emptyHint = 'Tap the heart on any recipe to save it here.',
}: FavoritesListProps) {
  const household = useHousehold();
  const { entries } = useFoodLog();
  const { width } = useWindowDimensions();
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);
  const any = recipes.length + foods.length > 0;
  return (
    <View className="gap-3 px-5">
      {any ? (
        <>
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              fitsTime={fitsCookingTime(r, household.cookingTime)}
            />
          ))}
          {foods.length ? (
            <View className="gap-3 pt-2">
              <AppText variant="heading" size="2xl">
                Single foods
              </AppText>
              <View className="flex-row flex-wrap" style={{ gap: GAP }}>
                {foods.map((f) => (
                  <FoodCard
                    key={f.id}
                    food={f}
                    width={cell}
                    tried={foodTriedOn(entries, f) !== null}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </>
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
      {any ? <Notice body="Favorites are saved on this phone only." /> : null}
    </View>
  );
}
