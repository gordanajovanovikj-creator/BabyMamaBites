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
  'baby-lentil-carrot-mash': require('@/assets/images/recipes/baby-lentil-carrot-mash.jpg'),
  'baby-egg-mash': require('@/assets/images/recipes/baby-egg-mash.jpg'),
  'baby-soft-veg-fingers': require('@/assets/images/recipes/baby-soft-veg-fingers.jpg'),
  'sheet-pan-salmon': require('@/assets/images/recipes/sheet-pan-salmon.jpg'),
  'overnight-oats': require('@/assets/images/recipes/overnight-oats.jpg'),
  'pb-banana-shake': require('@/assets/images/recipes/pb-banana-shake.jpg'),
  'warm-spiced-milk': require('@/assets/images/recipes/warm-spiced-milk.jpg'),
  'nut-butter-porridge': require('@/assets/images/recipes/nut-butter-porridge.jpg'),
  'egg-muffin-cups': require('@/assets/images/recipes/egg-muffin-cups.jpg'),
  'yogurt-parfait': require('@/assets/images/recipes/yogurt-parfait.jpg'),
  'avocado-egg-toast': require('@/assets/images/recipes/avocado-egg-toast.jpg'),
  'breakfast-burritos': require('@/assets/images/recipes/breakfast-burritos.jpg'),
  'baked-oatmeal': require('@/assets/images/recipes/baked-oatmeal.jpg'),
  'hummus-wrap': require('@/assets/images/recipes/hummus-wrap.jpg'),
  'chicken-quinoa-jars': require('@/assets/images/recipes/chicken-quinoa-jars.jpg'),
  'white-bean-tuna-salad': require('@/assets/images/recipes/white-bean-tuna-salad.jpg'),
  'black-bean-quesadilla': require('@/assets/images/recipes/black-bean-quesadilla.jpg'),
  'lentil-soup': require('@/assets/images/recipes/lentil-soup.jpg'),
  'turkey-chili': require('@/assets/images/recipes/turkey-chili.jpg'),
  'one-pot-pasta': require('@/assets/images/recipes/one-pot-pasta.jpg'),
  'chickpea-curry': require('@/assets/images/recipes/chickpea-curry.jpg'),
  'slow-cooker-chicken': require('@/assets/images/recipes/slow-cooker-chicken.jpg'),
  'energy-bites': require('@/assets/images/recipes/energy-bites.jpg'),
  'apple-pb': require('@/assets/images/recipes/apple-pb.jpg'),
  'snack-plate': require('@/assets/images/recipes/snack-plate.jpg'),
  'baby-lentil-pasta': require('@/assets/images/recipes/baby-lentil-pasta.jpg'),
  'toddler-cheesy-broccoli-rice': require('@/assets/images/recipes/toddler-cheesy-broccoli-rice.jpg'),
  'toddler-bean-quesadilla': require('@/assets/images/recipes/toddler-bean-quesadilla.jpg'),
};

export function recipePhoto(recipeId: string): ImageSource | undefined {
  return photos[recipeId];
}
