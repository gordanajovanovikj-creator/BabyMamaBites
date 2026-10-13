import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { foodCategoryLabels, type Food } from '@/content/foods';
import { allergenLabels } from '@/domain/profile-labels';
import { AllergenBadge } from '@/features/recipes/allergen-badge';
import { shadows } from '@/theme/colors';
import { AppText, cn } from '@/ui';

import { foodPhoto } from './food-photos';

export type FoodCardProps = {
  food: Food;
  width: number;
  /** Logged in the food diary at least once. */
  tried: boolean;
};

/** Grid card for the food guide: photo, allergen pill, name and age. */
export function FoodCard({ food, width, tried }: FoodCardProps) {
  const photo = foodPhoto(food.id);
  const allergen = food.allergen ? ` Common allergen: ${allergenLabels[food.allergen]}.` : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${food.name}. ${foodCategoryLabels[food.category]}, from ${food.fromMonths} months.${allergen}${tried ? ' Tried.' : ''}`}
      onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
      style={{ width, boxShadow: shadows.card }}
      className="overflow-hidden rounded-3xl border border-border bg-surface active:opacity-80"
    >
      <View
        className={cn(
          'h-36 items-center justify-center',
          photo ? 'bg-surface' : 'bg-surface-muted',
        )}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {photo ? (
          <Image
            source={photo}
            contentFit="cover"
            transition={150}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ) : (
          <AppText size="5xl">{food.emoji}</AppText>
        )}
        {food.allergen ? <AllergenBadge className="absolute left-2 top-2" /> : null}
        {tried ? (
          <View
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-primary"
            style={{ boxShadow: shadows.floatTight }}
          >
            <AppText variant="label" size="sm" color="on-primary" className="font-extrabold">
              ✓
            </AppText>
          </View>
        ) : null}
      </View>
      <View className="gap-1.5 px-3 pb-3 pt-1">
        <AppText
          variant="label"
          size="lg"
          className="min-h-12 font-bold leading-6"
          numberOfLines={2}
        >
          {food.name}
        </AppText>
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-accent px-2.5 py-0.5">
            <AppText variant="label" size="xs" className="font-bold">
              {`${food.fromMonths} m+`}
            </AppText>
          </View>
          <AppText variant="caption" size="sm" numberOfLines={1} className="flex-1">
            {foodCategoryLabels[food.category]}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}
