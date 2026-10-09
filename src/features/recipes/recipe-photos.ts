import type { ImageSource } from 'expo-image';

/**
 * Bundled recipe photos by recipe id. Recipes without a photo show their
 * color block and icon instead. Only add photos the app has the rights to use.
 */
const photos: Record<string, ImageSource> = {
  'banana-oat-smoothie': require('@/assets/images/recipes/banana-oat-smoothie.jpg'),
};

export function recipePhoto(recipeId: string): ImageSource | undefined {
  return photos[recipeId];
}
