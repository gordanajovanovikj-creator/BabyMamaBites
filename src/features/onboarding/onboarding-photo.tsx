import type { ImageSource } from 'expo-image';

export const onboardingPhotos = {
  welcome: require('@/assets/images/onboarding/welcome-kitchen.jpg'),
  babyLed: require('@/assets/images/onboarding/baby-led-weaning.jpg'),
  spoon: require('@/assets/images/onboarding/spoon-feeding.jpg'),
  family: require('@/assets/images/onboarding/family-kitchen.jpg'),
} satisfies Record<string, ImageSource>;
