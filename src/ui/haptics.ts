import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Gentle, quiet feedback for small moments. iOS skips these on its own in Low
 * Power Mode or when the user has turned system haptics off. Web is left out:
 * browser vibration is buzzy, not subtle. Failures are ignored; a haptic is
 * never worth an error.
 */
const enabled = Platform.OS !== 'web';

function run(fn: () => Promise<void>) {
  if (!enabled) return;
  fn().catch(() => {});
}

export const haptics = {
  /** A soft tap: saving a heart, moving to the next cook-mode step. */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Changing a choice: chips, tabs, ticking an ingredient. */
  select: () => run(() => Haptics.selectionAsync()),
  /** Something was saved: a food logged, a meal planned. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
};
