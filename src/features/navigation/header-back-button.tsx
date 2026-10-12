import { router } from 'expo-router';

import { RoundIconButton } from '@/ui';

/**
 * Header back button: the round white button used beside page titles, with no
 * text label (so a screen never shows the "(tabs)" route name).
 */
export function headerBackButton({ canGoBack }: { canGoBack?: boolean }) {
  if (!canGoBack) return null;
  return (
    <RoundIconButton
      symbol="chevron.left"
      fallback="‹"
      accessibilityLabel="Back"
      onPress={() => router.back()}
    />
  );
}
