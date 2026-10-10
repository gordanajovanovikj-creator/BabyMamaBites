import type { ImageSource } from 'expo-image';

/**
 * Bundled photos for Insights articles and tips, by id (ids are unique across both).
 * Items without a photo show their illustration instead. Credits: docs/photo-credits.md.
 */
const photos: Record<string, ImageSource> = {
  'newborn-snack-basket': require('@/assets/images/insights/newborn-snack-basket.jpg'),
  'newborn-overnight-oats': require('@/assets/images/insights/newborn-overnight-oats.jpg'),
  'solids-purees-first': require('@/assets/images/insights/solids-purees-first.jpg'),
  'food-refusal': require('@/assets/images/insights/food-refusal.jpg'),
  'solids-freezer-cubes': require('@/assets/images/insights/solids-freezer-cubes.jpg'),
  'homemade-baby-food': require('@/assets/images/insights/homemade-baby-food.jpg'),
  'hunger-cues': require('@/assets/images/insights/hunger-cues.jpg'),
  'high-chair': require('@/assets/images/insights/high-chair.jpg'),
  'gagging-vs-choking': require('@/assets/images/insights/gagging-vs-choking.jpg'),
  ready: require('@/assets/images/insights/ready.jpg'),
  'first-foods': require('@/assets/images/insights/first-foods.jpg'),
  'purees-vs-finger-foods': require('@/assets/images/insights/purees-vs-finger-foods.jpg'),
  allergens: require('@/assets/images/insights/allergens.jpg'),
  'toddler-picky-phases': require('@/assets/images/insights/toddler-picky-phases.jpg'),
  'cups-and-drinks': require('@/assets/images/insights/cups-and-drinks.jpg'),
  'solids-choking': require('@/assets/images/insights/solids-choking.jpg'),
  'foods-to-avoid': require('@/assets/images/insights/foods-to-avoid.jpg'),
  'newborn-meal-help': require('@/assets/images/insights/newborn-meal-help.jpg'),
  'newborn-rest': require('@/assets/images/insights/newborn-rest.jpg'),
  'newborn-water': require('@/assets/images/insights/newborn-water.jpg'),
  'cows-milk': require('@/assets/images/insights/cows-milk.jpg'),
  'feeling-low': require('@/assets/images/insights/feeling-low.jpg'),
  'toddler-share-plate': require('@/assets/images/insights/toddler-share-plate.jpg'),
};

export function libraryPhoto(id: string): ImageSource | undefined {
  return photos[id];
}
