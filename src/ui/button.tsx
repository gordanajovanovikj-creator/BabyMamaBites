import { Pressable, type PressableProps } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'quiet';

const containerClasses: Record<Variant, string> = {
  primary: 'bg-primary',
  secondary: 'bg-surface border-2 border-primary',
  quiet: 'bg-transparent',
};

const labelClasses: Record<Variant, string> = {
  primary: 'text-on-primary',
  secondary: 'text-primary',
  quiet: 'text-primary underline',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  className?: string;
};

/** Full-width, 56pt-tall button: easy to hit with a thumb while holding a baby. */
export function Button({ label, variant = 'primary', disabled, className, ...rest }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={8}
      className={cn(
        'min-h-14 items-center justify-center rounded-2xl px-6 py-3 active:opacity-80',
        containerClasses[variant],
        disabled && 'opacity-50',
        className,
      )}
      {...rest}
    >
      <AppText variant="label" className={cn('text-center text-lg', labelClasses[variant])}>
        {label}
      </AppText>
    </Pressable>
  );
}
