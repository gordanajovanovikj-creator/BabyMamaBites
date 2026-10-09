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
};

export function libraryPhoto(id: string): ImageSource | undefined {
  return photos[id];
}
