import type { ImageSource } from 'expo-image';

/**
 * Bundled recipe photos by recipe id. Recipes without a photo show their
 * color block and icon instead. Only add photos the app has the rights to use.
 */
const photos: Record<string, ImageSource> = {
  'banana-oat-smoothie': require('@/assets/images/recipes/banana-oat-smoothie.jpg'),
  'baby-oat-cereal': require('@/assets/images/recipes/baby-oat-cereal.jpg'),
  'baby-salmon-sweet-potato': require('@/assets/images/recipes/baby-salmon-sweet-potato.jpg'),
  'baby-pear-puree': require('@/assets/images/recipes/baby-pear-puree.jpg'),
  'baby-chicken-puree': require('@/assets/images/recipes/baby-chicken-puree.jpg'),
  'baby-avocado-banana-mash': require('@/assets/images/recipes/baby-avocado-banana-mash.jpg'),
  'baby-yogurt-berry-swirl': require('@/assets/images/recipes/baby-yogurt-berry-swirl.jpg'),
  'baby-sweet-potato-puree': require('@/assets/images/recipes/baby-sweet-potato-puree.jpg'),
};

export function recipePhoto(recipeId: string): ImageSource | undefined {
  return photos[recipeId];
}
