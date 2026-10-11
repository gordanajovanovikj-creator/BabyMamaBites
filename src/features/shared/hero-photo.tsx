import { Image, type ImageSource } from 'expo-image';
import { View } from 'react-native';

/** Wide photo at the top of an article or guide page. Decorative. */
export function HeroPhoto({ source, height = 220 }: { source: ImageSource; height?: number }) {
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      className="overflow-hidden rounded-xl bg-surface-muted"
      style={{ height }}
    >
      <Image
        source={source}
        contentFit="cover"
        transition={150}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </View>
  );
}
