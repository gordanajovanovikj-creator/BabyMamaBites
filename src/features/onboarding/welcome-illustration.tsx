import { Image } from 'expo-image';
import { useColorScheme, View } from 'react-native';

const ASPECT = 900 / 1484;

// Same artwork; the shirt is recoloured to match the primary button in each theme.
const light = require('@/assets/images/welcome-mama.png');
const dark = require('@/assets/images/welcome-mama-dark.png');

/** Mother cradling her baby, on a soft halo so it reads well in light and dark mode. */
export function WelcomeIllustration({ height = 260 }: { height?: number }) {
  const halo = height * 0.92;
  const scheme = useColorScheme();
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
        source={scheme === 'dark' ? dark : light}
        style={{ height, width: height * ASPECT }}
        contentFit="contain"
        accessible={false}
      />
    </View>
  );
}
