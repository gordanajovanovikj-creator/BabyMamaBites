import { Pressable } from 'react-native';

import { shadows } from '@/theme/colors';

import { AppText } from './app-text';
import { cn } from './cn';
import { haptics } from './haptics';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

/**
 * Selectable pill (filters, multi-choice answers): thin border and a soft shadow.
 * At least 48pt tall. Rows that scroll sideways need a little vertical padding
 * so the shadow isn't clipped.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  className,
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={
        onPress
          ? () => {
              if (!selected) haptics.select();
              onPress();
            }
          : undefined
      }
      hitSlop={4}
      className={cn(
        'min-h-12 items-center justify-center rounded-full border px-5 py-2 active:opacity-80',
        selected ? 'border-primary bg-primary' : 'border-border bg-surface',
        className,
      )}
      style={{ boxShadow: shadows.chip }}
    >
      <AppText variant="label" color={selected ? 'on-primary' : 'ink'} className="font-bold">
        {label}
      </AppText>
    </Pressable>
  );
}
