import { Pressable, type PressableProps } from 'react-native';

import { AppText, type TextColor } from './app-text';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'quiet';

const containerClasses: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surface-muted',
  quiet: 'bg-transparent',
};

const labelColors: Record<Variant, TextColor> = {
  primary: 'on-primary',
  secondary: 'primary',
  quiet: 'primary',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  /** 'full' stretches to the container; 'compact' is a centred pill. */
  size?: 'full' | 'compact';
  className?: string;
};

/** Full-width, 56pt-tall button: easy to hit with a thumb while holding a baby. */
export function Button({
  label,
  variant = 'primary',
  size = 'full',
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={8}
      className={cn(
        'min-h-14 items-center justify-center rounded-full px-6 py-3 active:opacity-80',
        containerClasses[variant],
        size === 'compact' && 'self-center px-10',
        disabled && 'opacity-50',
        className,
      )}
      {...rest}
    >
      <AppText
        variant="label"
        color={labelColors[variant]}
        size="lg"
        className={cn('text-center font-bold', variant === 'quiet' && 'underline')}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
