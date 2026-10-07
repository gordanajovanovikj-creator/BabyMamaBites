import { Text, type TextProps } from 'react-native';

import { cn } from './cn';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';
export type TextColor =
  'ink' | 'muted' | 'primary' | 'on-primary' | 'on-accent' | 'caution' | 'danger';

const variantClasses: Record<Variant, string> = {
  display: 'text-4xl font-extrabold tracking-tight',
  title: 'text-3xl font-extrabold tracking-tight',
  heading: 'text-xl font-bold',
  body: 'text-lg',
  label: 'text-base font-semibold',
  caption: 'text-base',
};

const colorClasses: Record<TextColor, string> = {
  ink: 'text-ink',
  muted: 'text-ink-muted',
  primary: 'text-primary',
  'on-primary': 'text-on-primary',
  'on-accent': 'text-on-accent',
  caution: 'text-caution-ink',
  danger: 'text-danger-ink',
};

const headerVariants: Variant[] = ['display', 'title', 'heading'];

export type AppTextProps = TextProps & {
  variant?: Variant;
  /** Text colour. Use this rather than a text-* colour class so styles never clash. */
  color?: TextColor;
  className?: string;
};

/** Text that follows the type scale and scales with the user's Dynamic Type setting. */
export function AppText({ variant = 'body', color, className, ...rest }: AppTextProps) {
  const resolved = color ?? (variant === 'caption' ? 'muted' : 'ink');
  return (
    <Text
      accessibilityRole={headerVariants.includes(variant) ? 'header' : undefined}
      className={cn(variantClasses[variant], colorClasses[resolved], className)}
      {...rest}
    />
  );
}
