import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';

export const onboardingPhotos = {
  welcome: require('@/assets/images/onboarding/welcome-mom-baby.jpg'),
  babyLed: require('@/assets/images/onboarding/baby-led-weaning.jpg'),
  spoon: require('@/assets/images/onboarding/spoon-feeding.jpg'),
} satisfies Record<string, ImageSource>;

export type OnboardingPhotoProps = {
  source: ImageSource;
  /** Read by VoiceOver. */
  label: string;
  height: number;
  /** Where to anchor the crop, so faces stay in frame. */
  focus?: 'center' | 'top';
};

/** Full-width rounded photo used at the top of welcome-style screens. */
export function OnboardingPhoto({ source, label, height, focus = 'center' }: OnboardingPhotoProps) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      className="overflow-hidden rounded-3xl bg-surface-muted"
      style={{ height }}
    >
      <Image
        source={source}
        contentFit="cover"
        contentPosition={focus}
        transition={150}
        accessible={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </View>
  );
}
