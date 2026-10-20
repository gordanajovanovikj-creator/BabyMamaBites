import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { groupByAisle, shoppingProgress } from '@/domain/shopping';
import { AppText, SymbolIcon } from '@/ui';

import { useShopping } from './shopping-context';

/** How many items Today previews before "and N more". */
const PREVIEW = 3;

/** Home's shopping list snapshot: what's left to buy, a few items, and a way in. */
export function ShoppingCard() {
  const { items } = useShopping();
  const { left, total } = shoppingProgress(items);
  const toBuy = groupByAisle(items).flatMap((g) => g.items);
  const preview = toBuy.slice(0, PREVIEW);
  const open = () => router.push('/shopping');

  const summary =
    total === 0
      ? 'Add items, or ingredients from any recipe.'
      : left === 0
        ? 'All done! Everything is checked off.'
        : `${left} of ${total} left to buy`;

  return (
    <View className="gap-3 px-5">
      <View className="flex-row items-end justify-between">
        <AppText variant="heading" size="2xl" className="flex-1">
          Shopping list
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open the shopping list"
          onPress={open}
          hitSlop={8}
          className="min-h-11 justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            Open ›
          </AppText>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Shopping list: ${summary}. Opens the list.`}
        onPress={open}
        className="min-h-16 gap-2 rounded-3xl border border-border bg-surface p-4 active:opacity-70"
      >
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
            <SymbolIcon icon="cart.fill" emoji="🛒" size={22} />
          </View>
          <AppText variant="label" className="flex-1 font-bold">
            {summary}
          </AppText>
        </View>
        {preview.length ? (
          <AppText variant="caption" size="sm" numberOfLines={2}>
            {preview.map((i) => i.text).join(' · ')}
            {toBuy.length > PREVIEW ? ` · and ${toBuy.length - PREVIEW} more` : ''}
          </AppText>
        ) : null}
      </Pressable>
    </View>
  );
}
