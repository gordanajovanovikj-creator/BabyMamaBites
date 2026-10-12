import { router } from 'expo-router';
import { Platform } from 'react-native';

import { RoundIconButton } from '@/ui';

/**
 * Header back button for Android and the web preview: the round white button
 * used beside page titles, with no text label (so a screen never shows the
 * "(tabs)" route name).
 */
function roundBackButton({ canGoBack }: { canGoBack?: boolean }) {
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

/**
 * Pass as a stack's `headerLeft`. On iOS the system back button stays (shown
 * without a label by `headerBackButtonDisplayMode: 'minimal'`): iOS 26 already
 * draws it as a round glass button, and a custom button would get a second
 * ring around it.
 */
export const headerBackButton = Platform.OS === 'ios' ? undefined : roundBackButton;
