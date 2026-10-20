import { Pressable, View } from 'react-native';

import { AppText, cn } from '@/ui';

export type CheckRowProps = {
  text: string;
  checked: boolean;
  onPress(): void;
  /** Small second line, e.g. the recipe an item came from. */
  detail?: string | null;
  /** Strike the text through when checked (a bought item), not for a picked ingredient. */
  strike?: boolean;
  onLongPress?(): void;
  accessibilityHint?: string;
  /** Inside a card: tighter side padding, and no rule under the last row. */
  inCard?: boolean;
  last?: boolean;
};

/** A full-width row with a round check on the right, 56pt tall. */
export function CheckRow({
  text,
  checked,
  onPress,
  detail,
  strike = false,
  onLongPress,
  accessibilityHint,
  inCard = false,
  last = false,
}: CheckRowProps) {
  const done = strike && checked;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={detail ? `${text}. ${detail}` : text}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      onLongPress={onLongPress}
      className={cn(
        'min-h-14 flex-row items-center gap-3 py-3 active:bg-surface-muted',
        inCard ? 'px-4' : 'px-5',
        !last && 'border-b border-border',
      )}
    >
      <View className="flex-1 gap-0.5">
        <AppText color={done ? 'muted' : 'ink'} className={cn(done && 'line-through')}>
          {text}
        </AppText>
        {detail ? (
          <AppText variant="caption" size="sm" numberOfLines={1}>
            {detail}
          </AppText>
        ) : null}
      </View>
      <View
        className={cn(
          'h-6 w-6 items-center justify-center rounded-full border-2',
          checked ? 'border-primary bg-primary' : 'border-border',
        )}
      >
        {checked ? (
          <AppText variant="label" size="xs" color="on-primary">
            ✓
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
