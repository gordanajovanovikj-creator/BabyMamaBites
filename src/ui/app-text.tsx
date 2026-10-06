import { Text, type TextProps } from 'react-native';

import { cn } from './cn';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

const variantClasses: Record<Variant, string> = {
  display: 'text-3xl font-bold text-ink',
  title: 'text-2xl font-bold text-ink',
  heading: 'text-xl font-semibold text-ink',
  body: 'text-lg text-ink',
  label: 'text-base font-semibold text-ink',
  caption: 'text-base text-ink-muted',
};

const headerVariants: Variant[] = ['display', 'title', 'heading'];

export type AppTextProps = TextProps & {
  variant?: Variant;
  className?: string;
};

/** Text that follows the type scale and scales with the user's Dynamic Type setting. */
export function AppText({ variant = 'body', className, ...rest }: AppTextProps) {
  return (
    <Text
      accessibilityRole={headerVariants.includes(variant) ? 'header' : undefined}
      className={cn(variantClasses[variant], className)}
      {...rest}
    />
  );
}
