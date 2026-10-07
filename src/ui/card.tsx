import { Pressable, View, type ViewProps } from 'react-native';

import { cn } from './cn';

type Tone = 'surface' | 'muted' | 'primary' | 'accent';

const toneClasses: Record<Tone, string> = {
  surface: 'bg-surface',
  muted: 'bg-surface-muted',
  primary: 'bg-primary',
  accent: 'bg-accent',
};

export type CardProps = ViewProps & {
  /** Background colour. Use this rather than a bg-* class so styles never clash. */
  tone?: Tone;
  className?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Rounded content container. Becomes a single tappable element when `onPress` is set. */
export function Card({
  tone = 'surface',
  className,
  onPress,
  children,
  accessibilityLabel,
  ...rest
}: CardProps) {
  const classes = cn('rounded-3xl p-5', toneClasses[tone], className);
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className={cn(classes, 'active:opacity-80')}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View className={classes} accessibilityLabel={accessibilityLabel} {...rest}>
      {children}
    </View>
  );
}
