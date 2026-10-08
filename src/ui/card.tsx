import { Pressable, View, type ViewProps } from 'react-native';

import { cn } from './cn';

export type CardTone = 'surface' | 'muted' | 'primary' | 'accent' | 'sky' | 'deep';

const toneClasses: Record<CardTone, string> = {
  surface: 'bg-surface',
  muted: 'bg-surface-muted',
  primary: 'bg-primary',
  accent: 'bg-accent',
  sky: 'bg-sky',
  deep: 'bg-deep',
};

/** Background class for a tone, for views that aren't Cards (e.g. icon tiles). */
export function toneBackground(tone: CardTone): string {
  return toneClasses[tone];
}

export type CardProps = ViewProps & {
  /** Background color. Use this rather than a bg-* class so styles never clash. */
  tone?: CardTone;
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
        style={rest.style}
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
