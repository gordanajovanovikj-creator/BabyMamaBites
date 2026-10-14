import type { ImageSource } from 'expo-image';

/**
 * Photo for each monthly guide, reusing the app's approved recipe, article and welcome
 * photos (credits: docs/photo-credits.md). Guides without one show no photo.
 */
const photos: Record<string, ImageSource> = {
  'month-1': require('@/assets/images/onboarding/welcome-mom-baby.jpg'),
  'month-2': require('@/assets/images/insights/newborn-rest.jpg'),
  'month-3': require('@/assets/images/insights/newborn-overnight-oats.jpg'),
  'month-4': require('@/assets/images/insights/newborn-water.jpg'),
  'month-5': require('@/assets/images/insights/ready.jpg'),
  'month-6': require('@/assets/images/insights/first-foods.jpg'),
  'month-7': require('@/assets/images/insights/solids-purees-first.jpg'),
  'month-8': require('@/assets/images/recipes/baby-lentil-carrot-mash.jpg'),
  'month-9': require('@/assets/images/insights/learning-to-chew.jpg'),
  'month-10': require('@/assets/images/recipes/baby-soft-veg-fingers.jpg'),
  'month-11': require('@/assets/images/insights/high-chair.jpg'),
  'month-12': require('@/assets/images/recipes/baby-banana-oat-pancakes.jpg'),
  'months-12-18': require('@/assets/images/insights/toddler-share-plate.jpg'),
  'months-18-24': require('@/assets/images/insights/toddler-picky-phases.jpg'),
  'months-24-plus': require('@/assets/images/recipes/toddler-overnight-oats.jpg'),
};

export function guidePhoto(id: string): ImageSource | undefined {
  return photos[id];
}
