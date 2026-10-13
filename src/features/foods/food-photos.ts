import type { ImageSource } from 'expo-image';

/** Bundled food guide photos by food id. Only add photos the app has the rights to use. */
const photos: Record<string, ImageSource> = {
  'sweet-potato': require('@/assets/images/foods/sweet-potato.jpg'),
  'carrot': require('@/assets/images/foods/carrot.jpg'),
  'broccoli': require('@/assets/images/foods/broccoli.jpg'),
  'peas': require('@/assets/images/foods/peas.jpg'),
  'spinach': require('@/assets/images/foods/spinach.jpg'),
  'zucchini': require('@/assets/images/foods/zucchini.jpg'),
  'butternut-squash': require('@/assets/images/foods/butternut-squash.jpg'),
  'green-beans': require('@/assets/images/foods/green-beans.jpg'),
  'cauliflower': require('@/assets/images/foods/cauliflower.jpg'),
  'avocado': require('@/assets/images/foods/avocado.jpg'),
  'banana': require('@/assets/images/foods/banana.jpg'),
  'apple': require('@/assets/images/foods/apple.jpg'),
  'pear': require('@/assets/images/foods/pear.jpg'),
  'blueberries': require('@/assets/images/foods/blueberries.jpg'),
  'strawberries': require('@/assets/images/foods/strawberries.jpg'),
  'mango': require('@/assets/images/foods/mango.jpg'),
  'peach': require('@/assets/images/foods/peach.jpg'),
  'egg': require('@/assets/images/foods/egg.jpg'),
  'chicken': require('@/assets/images/foods/chicken.jpg'),
  'beef': require('@/assets/images/foods/beef.jpg'),
  'turkey': require('@/assets/images/foods/turkey.jpg'),
  'salmon': require('@/assets/images/foods/salmon.jpg'),
  'shrimp': require('@/assets/images/foods/shrimp.jpg'),
  'lentils': require('@/assets/images/foods/lentils.jpg'),
  'black-beans': require('@/assets/images/foods/black-beans.jpg'),
  'tofu': require('@/assets/images/foods/tofu.jpg'),
  'peanut-butter': require('@/assets/images/foods/peanut-butter.jpg'),
  'almond-butter': require('@/assets/images/foods/almond-butter.jpg'),
  'tahini': require('@/assets/images/foods/tahini.jpg'),
  'infant-cereal': require('@/assets/images/foods/infant-cereal.jpg'),
  'oats': require('@/assets/images/foods/oats.jpg'),
  'rice': require('@/assets/images/foods/rice.jpg'),
  'pasta': require('@/assets/images/foods/pasta.jpg'),
  'bread': require('@/assets/images/foods/bread.jpg'),
  'yogurt': require('@/assets/images/foods/yogurt.jpg'),
  'cheese': require('@/assets/images/foods/cheese.jpg'),
};

export function foodPhoto(id: string): ImageSource | undefined {
  return photos[id];
}
