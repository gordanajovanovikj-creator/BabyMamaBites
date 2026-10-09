import { Image } from 'expo-image';
import { View } from 'react-native';

const ASPECT = 900 / 1484;

// The shirt is recolored to match the primary (sage) button.
const artwork = require('@/assets/images/welcome-mama.png');

/** Mother cradling her baby, on a soft oat halo. */
export function WelcomeIllustration({ height = 260 }: { height?: number }) {
  const halo = height * 0.92;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="Illustration of a mother holding her baby"
      className="items-center justify-center"
      style={{ height }}
    >
      <View
        className="absolute rounded-full bg-surface-muted"
        style={{ width: halo, height: halo }}
      />
      <Image
        source={artwork}
        style={{ height, width: height * ASPECT }}
        contentFit="contain"
        accessible={false}
      />
    </View>
  );
}
