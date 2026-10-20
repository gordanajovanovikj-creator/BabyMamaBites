import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Share, View } from 'react-native';

import {
  groupByAisle,
  listAsText,
  SHOPPING_ITEM_MAX_LENGTH,
  shoppingAisleLabels,
  shoppingProgress,
  sortShopping,
  type ShoppingItem,
} from '@/domain/shopping';
import { CheckRow } from '@/features/shopping/check-row';
import { useShopping } from '@/features/shopping/shopping-context';
import { AppText, Button, haptics, Notice, Screen, TextField } from '@/ui';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <AppText
        variant="label"
        size="sm"
        color="muted"
        accessibilityRole="header"
        className="px-5 pb-1 pt-5 font-bold uppercase"
      >
        {title}
      </AppText>
      {children}
    </View>
  );
}

/** The shopping list: add items, check them off in the store, share it. Saved on this phone. */
export default function ShoppingListScreen() {
  const { items, add, toggle, remove, clearChecked } = useShopping();
  const [draft, setDraft] = useState('');
  const groups = groupByAisle(items);
  const checked = sortShopping(items.filter((i) => i.checked));
  const { left, total } = shoppingProgress(items);

  const addDraft = () => {
    const text = draft.trim();
    if (!text) return;
    add([{ text, recipeTitle: null }])
      .then(() => {
        haptics.success();
        setDraft('');
      })
      .catch(() => Alert.alert('Could not save', 'Please try again.'));
  };

  const confirmRemove = (item: ShoppingItem) =>
    Alert.alert('Remove from list?', item.text, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(item.id).catch(() => {}) },
    ]);

  const row = (item: ShoppingItem) => (
    <CheckRow
      key={item.id}
      text={item.text}
      detail={item.recipeTitle}
      checked={item.checked}
      strike
      onPress={() => {
        haptics.select();
        toggle(item.id).catch(() => {});
      }}
      onLongPress={() => confirmRemove(item)}
      accessibilityHint="Double-tap to check off. Long press to remove."
    />
  );

  return (
    <Screen padded={false} className="gap-0 pt-4">
      <View className="gap-3 px-5">
        <TextField
          label="Add an item"
          value={draft}
          onChangeText={setDraft}
          maxLength={SHOPPING_ITEM_MAX_LENGTH}
          placeholder="e.g. Bananas"
          returnKeyType="done"
          submitBehavior="submit"
          onSubmitEditing={addDraft}
        />
        <Button label="Add to list" variant="secondary" disabled={!draft.trim()} onPress={addDraft} />
        <AppText variant="caption" size="sm">
          {total
            ? `${left} of ${total} left to buy. Long press an item to remove it.`
            : 'Your list is saved on this phone only.'}
        </AppText>
      </View>

      {total === 0 ? (
        <View className="px-5 pt-6">
          <Notice
            title="Your list is empty"
            body="Add items above, or tap “Add ingredients to shopping list” on any recipe."
          />
        </View>
      ) : null}

      {groups.map((g) => (
        <Section key={g.aisle} title={shoppingAisleLabels[g.aisle]}>
          {g.items.map(row)}
        </Section>
      ))}

      {checked.length ? (
        <Section title={`In the cart (${checked.length})`}>{checked.map(row)}</Section>
      ) : null}

      <View className="gap-1 px-5 pt-6">
        {checked.length ? (
          <Button
            label="Clear checked items"
            variant="secondary"
            onPress={() => clearChecked().catch(() => {})}
          />
        ) : null}
        <Button
          label="Add this week's planned meals"
          variant="quiet"
          accessibilityLabel="Add ingredients from this week's meal plan"
          onPress={() => router.push({ pathname: '/shopping/add', params: { week: 'this' } })}
        />
        {left ? (
          <Button
            label="Share list"
            variant="quiet"
            accessibilityLabel="Share the items left to buy as text"
            onPress={() => Share.share({ message: listAsText(items) }).catch(() => {})}
          />
        ) : null}
      </View>
    </Screen>
  );
}
