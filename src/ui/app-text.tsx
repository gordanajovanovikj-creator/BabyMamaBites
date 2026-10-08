import { Text, type TextProps } from 'react-native';

import { cn } from './cn';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';
export type TextColor =
  | 'ink'
  | 'muted'
  | 'primary'
  | 'on-primary'
  | 'on-accent'
  | 'on-sky'
  | 'on-deep'
  | 'caution'
  | 'danger';

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

const variantClasses: Record<Variant, string> = {
  display: 'font-extrabold tracking-tight',
  title: 'font-extrabold tracking-tight',
  heading: 'font-bold',
  body: '',
  label: 'font-semibold',
  caption: '',
};

const variantSizes: Record<Variant, TextSize> = {
  display: '4xl',
  title: '3xl',
  heading: 'xl',
  body: 'lg',
  label: 'base',
  caption: 'base',
};

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

const colorClasses: Record<TextColor, string> = {
  ink: 'text-ink',
  muted: 'text-ink-muted',
  primary: 'text-primary',
  'on-primary': 'text-on-primary',
  'on-accent': 'text-on-accent',
  'on-sky': 'text-on-sky',
  'on-deep': 'text-on-deep',
  caution: 'text-caution-ink',
  danger: 'text-danger-ink',
};

const headerVariants: Variant[] = ['display', 'title', 'heading'];

export type AppTextProps = TextProps & {
  variant?: Variant;
  /** Text color. Use this rather than a text-* color class so styles never clash. */
  color?: TextColor;
  /** Font size. Use this rather than a text-* size class so styles never clash. */
  size?: TextSize;
  className?: string;
};

/** Text that follows the type scale and scales with the user's Dynamic Type setting. */
export function AppText({ variant = 'body', color, size, className, ...rest }: AppTextProps) {
  const resolved = color ?? (variant === 'caption' ? 'muted' : 'ink');
  return (
    <Text
      accessibilityRole={headerVariants.includes(variant) ? 'header' : undefined}
      className={cn(
        variantClasses[variant],
        sizeClasses[size ?? variantSizes[variant]],
        colorClasses[resolved],
        className,
      )}
      {...rest}
    />
  );
}
