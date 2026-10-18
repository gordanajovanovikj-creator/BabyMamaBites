import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  cn,
  FlatButtonsContext,
  RoundIconButton,
  SymbolIcon,
  toneBackground,
  useScrolledPastHero,
  type CardTone,
} from '@/ui';

export type PictureHeroProps = {
  tone: CardTone;
  icon: string;
  emoji: string;
  height?: number;
  /** Artwork shown instead of the icon (e.g. a vector illustration). */
  art?: ReactNode;
  /** A full-bleed photo; takes the place of the color block and icon. */
  photo?: ImageSource;
};

/**
 * Full-width picture area at the top of a page. Pair it with `HeroTopBar` as
 * the Screen's `overlay` so the back button stays put while the page scrolls.
 * Shows a large icon on a soft color when there is no photo.
 */
export function PictureHero({ tone, icon, emoji, height, art, photo }: PictureHeroProps) {
  const insets = useSafeAreaInsets();
  const h = height ?? (photo ? 360 : 300);
  return (
    <View
      className={cn('items-center justify-center', toneBackground(tone))}
      style={{ height: h + insets.top, paddingTop: insets.top }}
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
    </View>
  );
}

/**
 * Back button (and an optional right-hand button) that float over a hero and don't
 * scroll. Once the picture scrolls away, the bar turns solid white and shows `title`,
 * so you always know which page you're on.
 */
export function HeroTopBar({ right, title }: { right?: ReactNode; title?: string }) {
  const insets = useSafeAreaInsets();
  const solid = useScrolledPastHero() && !!title;
  return (
    <FlatButtonsContext.Provider value={solid}>
      <View
        pointerEvents="box-none"
        className={cn(
          'flex-row items-center justify-between gap-3 px-5 pb-2',
          solid && 'border-b border-border bg-canvas',
        )}
        style={{ paddingTop: insets.top + 8 }}
      >
        <RoundIconButton
          symbol="chevron.left"
          fallback="‹"
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
        {solid ? (
          <AppText
            variant="label"
            size="lg"
            numberOfLines={1}
            className="flex-1 text-center font-bold"
            accessibilityRole="header"
          >
            {title}
          </AppText>
        ) : null}
        {right ?? (solid ? <View className="w-12" /> : null)}
      </View>
    </FlatButtonsContext.Provider>
  );
}
