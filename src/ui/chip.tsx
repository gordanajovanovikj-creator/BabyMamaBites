import { Pressable } from 'react-native';

import { shadows } from '@/theme/colors';

import { AppText } from './app-text';
import { cn } from './cn';

export type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** A thin border and soft shadow, for answer chips on a plain page (not filter rows). */
  raised?: boolean;
  className?: string;
};

/** Selectable pill (filters, multi-choice answers). At least 48pt tall. */
export function Chip({ label, selected = false, onPress, raised = false, className }: ChipProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'min-h-12 items-center justify-center rounded-full px-5 py-2 active:opacity-80',
        raised ? 'border' : 'border-2',
        selected ? 'border-primary bg-primary' : 'border-border bg-surface',
        className,
      )}
      style={raised ? { boxShadow: shadows.chip } : undefined}
    >
      <AppText variant="label" color={selected ? 'on-primary' : 'ink'} className="font-bold">
        {label}
      </AppText>
    </Pressable>
  );
}
