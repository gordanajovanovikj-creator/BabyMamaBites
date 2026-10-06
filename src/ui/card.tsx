import { Pressable, View, type ViewProps } from 'react-native';

import { cn } from './cn';

export type CardProps = ViewProps & {
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

const base = 'rounded-3xl border border-border bg-surface p-5';

/** Rounded content container. Becomes a single tappable element when `onPress` is set. */
export function Card({ className, onPress, children, accessibilityLabel, ...rest }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={cn(base, 'active:opacity-80', className)}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View className={cn(base, className)} accessibilityLabel={accessibilityLabel} {...rest}>
      {children}
    </View>
  );
}
