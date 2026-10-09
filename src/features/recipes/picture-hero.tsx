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
};

/**
 * Full-width picture area at the top of a page with a floating back button.
 * Shows a large icon on a soft color until recipe photos are added.
 */
export function PictureHero({ tone, icon, emoji, height = 300, right, art }: PictureHeroProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('items-center justify-center', toneBackground(tone))}
      style={{ height: height + insets.top, paddingTop: insets.top }}
      importantForAccessibility="no"
    >
      {art ?? <SymbolIcon icon={icon} emoji={emoji} size={96} />}
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
