import { View } from 'react-native';

import { cn } from './cn';
import { SymbolIcon } from './symbol-icon';

export type IconBadgeProps = {
  /** SF Symbol name (iOS). */
  icon: string;
  /** Shown where SF Symbols aren't available (Android, web). */
  emoji: string;
  size?: number;
  /** Cream on white backgrounds; white on cream, beige or colored cards. */
  tone?: 'accent' | 'surface';
};

/** The app's icon style: a green symbol in a round badge. Decorative. */
export function IconBadge({ icon, emoji, size = 44, tone = 'accent' }: IconBadgeProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={cn(
        'items-center justify-center rounded-full',
        tone === 'accent' ? 'bg-accent' : 'bg-surface',
      )}
      style={{ width: size, height: size }}
    >
      <SymbolIcon icon={icon} emoji={emoji} size={Math.round(size * 0.5)} />
    </View>
  );
}
