import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { SHOPPING_ITEM_MAX_LENGTH } from '@/domain/shopping';
import { usePalette } from '@/theme/use-palette';
import { AppText, cn } from '@/ui';

const inputText = { fontSize: 18 };

/** One pill-shaped field with a round + button; the keyboard's Done adds the item too. */
export function AddItemField({ onAdd }: { onAdd(text: string): Promise<boolean> }) {
  const palette = usePalette();
  const [draft, setDraft] = useState('');
  const ready = draft.trim().length > 0;
  const submit = async () => {
    if (!ready) return;
    if (await onAdd(draft.trim())) setDraft('');
  };
  return (
    <View className="flex-row items-center gap-2 rounded-full border border-border bg-surface p-1.5 pl-5">
      <TextInput
        accessibilityLabel="Add an item"
        value={draft}
        onChangeText={setDraft}
        maxLength={SHOPPING_ITEM_MAX_LENGTH}
        placeholder="Add an item, like bananas"
        placeholderTextColor={palette.inkMuted}
        returnKeyType="done"
        submitBehavior="submit"
        onSubmitEditing={submit}
        className="min-h-12 min-w-0 flex-1 text-ink"
        // Font size only: a line height pushes typed text off-center on iOS.
        style={inputText}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add to list"
        accessibilityState={{ disabled: !ready }}
        disabled={!ready}
        onPress={submit}
        className={cn(
          'h-12 w-12 items-center justify-center rounded-full active:opacity-80',
          ready ? 'bg-primary' : 'bg-surface-muted',
        )}
      >
        <AppText variant="title" size="2xl" color={ready ? 'on-primary' : 'muted'}>
          +
        </AppText>
      </Pressable>
    </View>
  );
}
