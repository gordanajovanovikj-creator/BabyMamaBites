import { router } from 'expo-router';
import { Alert, Share, View } from 'react-native';

import {
  groupByAisle,
  listAsText,
  shoppingAisleIcon,
  shoppingAisleLabels,
  shoppingProgress,
  sortShopping,
  type ShoppingItem,
} from '@/domain/shopping';
import { AddItemField } from '@/features/shopping/add-item-field';
import { AisleCard } from '@/features/shopping/aisle-card';
import { CheckRow } from '@/features/shopping/check-row';
import { useShopping } from '@/features/shopping/shopping-context';
import { ShoppingHeader } from '@/features/shopping/shopping-header';
import { withPremium } from '@/features/subscription/premium-gate';
import { AppText, Button, haptics, IconBadge, Screen } from '@/ui';

/** The shopping list: add items, check them off in the store, share it. Saved on this phone. */
function ShoppingListScreen() {
  const { items, add, toggle, remove, clearChecked } = useShopping();
  const groups = groupByAisle(items);
  const checked = sortShopping(items.filter((i) => i.checked));
  const { left, total } = shoppingProgress(items);

  const addItem = (text: string) =>
    add([{ text, recipeTitle: null }])
      .then(() => {
        haptics.success();
        return true;
      })
      .catch(() => {
        Alert.alert('Could not save', 'Please try again.');
        return false;
      });

  const confirmRemove = (item: ShoppingItem) =>
    Alert.alert('Remove from list?', item.text, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(item.id).catch(() => {}) },
    ]);

  const rows = (list: ShoppingItem[]) =>
    list.map((item, i) => (
      <CheckRow
        key={item.id}
        text={item.text}
        detail={item.recipeTitle}
        checked={item.checked}
        strike
        inCard
        last={i === list.length - 1}
        onPress={() => {
          haptics.select();
          toggle(item.id).catch(() => {});
        }}
        onLongPress={() => confirmRemove(item)}
        accessibilityHint="Double-tap to check off. Long press to remove."
      />
    ));

  return (
    <Screen>
      <ShoppingHeader left={left} total={total} />
      <AddItemField onAdd={addItem} />

      {total === 0 ? (
        <View className="items-center gap-2 rounded-3xl border border-dashed border-border px-6 py-8">
          <IconBadge icon="basket.fill" emoji="🧺" size={64} />
          <AppText variant="heading" className="text-center">
            Your list is empty
          </AppText>
          <AppText color="muted" className="text-center">
            Add items above, or tap “Add ingredients to shopping list” on any recipe.
          </AppText>
        </View>
      ) : null}

      {groups.map((g) => (
        <AisleCard
          key={g.aisle}
          icon={shoppingAisleIcon[g.aisle].icon}
          emoji={shoppingAisleIcon[g.aisle].emoji}
          title={shoppingAisleLabels[g.aisle]}
          count={g.items.length}
        >
          {rows(g.items)}
        </AisleCard>
      ))}

      {checked.length ? (
        <AisleCard
          icon="checkmark.circle.fill"
          emoji="✅"
          title="In the cart"
          count={checked.length}
          muted
          action={{
            label: 'Clear',
            accessibilityLabel: 'Clear the items in the cart',
            onPress: () => clearChecked().catch(() => {}),
          }}
        >
          {rows(checked)}
        </AisleCard>
      ) : null}

      <View className="flex-row gap-3 pt-2">
        <Button
          className="flex-1"
          label="Meal plan"
          variant="secondary"
          accessibilityLabel="Add ingredients from this week's meal plan"
          onPress={() => router.push({ pathname: '/shopping/add', params: { week: 'this' } })}
        />
        {left ? (
          <Button
            className="flex-1"
            label="Share list"
            variant="secondary"
            accessibilityLabel="Share the items left to buy as text"
            onPress={() => Share.share({ message: listAsText(items) }).catch(() => {})}
          />
        ) : null}
      </View>
      {total ? (
        <AppText variant="caption" size="sm" className="text-center">
          Tap to check off. Long press an item to remove it.
        </AppText>
      ) : null}
    </Screen>
  );
}

export default withPremium('shopping', ShoppingListScreen);
