import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn, RoundIconButton, SymbolIcon, toneBackground, type CardTone } from '@/ui';

export type PictureHeroProps = {
  tone: CardTone;
  icon: string;
  emoji: string;
  height?: number;
  /** Extra button shown top-right (e.g. a heart). */
  right?: ReactNode;
  /** Artwork shown instead of the icon (e.g. a vector illustration). */
  art?: ReactNode;
  /** A full-bleed photo; takes the place of the color block and icon. */
  photo?: ImageSource;
};

/**
 * Full-width picture area at the top of a page with a floating back button.
 * Shows a large icon on a soft color until recipe photos are added.
 */
export function PictureHero({
  tone,
  icon,
  emoji,
  height = 300,
  right,
  art,
  photo,
}: PictureHeroProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('items-center justify-center', toneBackground(tone))}
      style={{ height: height + insets.top, paddingTop: insets.top }}
      importantForAccessibility="no"
    >
      {photo ? (
        <Image
          source={photo}
          contentFit="cover"
          transition={150}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : (
        (art ?? <SymbolIcon icon={icon} emoji={emoji} size={96} />)
      )}
      <View
        className="absolute left-5 right-5 flex-row justify-between"
        style={{ top: insets.top + 8 }}
      >
        <RoundIconButton
          symbol="chevron.left"
          fallback="‹"
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        {right ?? null}
      </View>
    </View>
  );
}
