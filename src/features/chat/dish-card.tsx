import { router } from 'expo-router';
import { View } from 'react-native';

import { dishToParam, type ChatDish } from '@/domain/chat';
import { AppText, Button, IconBadge } from '@/ui';

/** A dish the helper suggested, with a button to put its ingredients on the shopping list. */
export function DishCard({ dish }: { dish: ChatDish }) {
  const count = dish.ingredients.length;
  return (
    <View className="gap-3 rounded-3xl border border-border bg-surface p-4">
      <View className="flex-row items-center gap-3">
        <IconBadge icon="fork.knife" emoji="🍽️" size={40} />
        <View className="flex-1">
          <AppText variant="heading" size="lg">
            {dish.name}
          </AppText>
          <AppText variant="caption" size="sm">
            {`${count} ${count === 1 ? 'ingredient' : 'ingredients'}`}
          </AppText>
        </View>
      </View>
      <Button
        label="Add to shopping list"
        variant="secondary"
        accessibilityLabel={`Add the ingredients for ${dish.name} to your shopping list`}
        onPress={() =>
          router.push({ pathname: '/shopping/add', params: { dish: dishToParam(dish) } })
        }
      />
    </View>
  );
}
