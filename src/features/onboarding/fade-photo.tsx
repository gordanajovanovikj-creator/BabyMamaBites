import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

export type FadePhotoProps = {
  source: ImageSource;
  /** Read by VoiceOver. */
  label: string;
  height: number;
  /** Where to anchor the crop, so faces (or the high chair) stay in frame. */
  position?: 'top' | 'center' | 'bottom';
  /** Share of the photo that fades out at the bottom. */
  fade?: number;
};

/** Edge-to-edge photo pinned to the top of the screen that fades into white at the bottom. */
export function FadePhoto({
  source,
  label,
  height,
  position = 'top',
  fade = DEFAULT_FADE,
}: FadePhotoProps) {
  const palette = usePalette();
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height }}
    >
      <Image
        source={source}
        contentFit="cover"
        contentPosition={position}
        transition={150}
        accessible={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <LinearGradient
        colors={[`${palette.canvas}00`, palette.canvas]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: fadeHeight(height, fade),
        }}
      />
    </View>
  );
}

/** How much of the photo's bottom fades out; text can start where the fade begins. */
export function fadeHeight(photoHeight: number, fade = DEFAULT_FADE) {
  return Math.round(photoHeight * fade);
}

const DEFAULT_FADE = 0.45;
