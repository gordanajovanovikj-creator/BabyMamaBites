import { Pressable } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

/** Selectable pill (filters, multi-choice answers). At least 48pt tall. */
export function Chip({ label, selected = false, onPress, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'min-h-12 items-center justify-center rounded-full border-2 px-5 py-2 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-border bg-surface',
        className,
      )}
    >
      <AppText variant="label" color={selected ? 'on-primary' : 'ink'} className="font-bold">
        {label}
      </AppText>
    </Pressable>
  );
}
