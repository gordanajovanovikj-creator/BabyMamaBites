import { View } from 'react-native';

import { AppText, type TextColor } from './app-text';

export type BulletListProps = {
  items: string[];
  /** Text and dot color inside a colored card (danger, caution); green dots on ink otherwise. */
  color?: TextColor;
};

/** A list with round dots, as used in guides, articles and safety cards. */
export function BulletList({ items, color }: BulletListProps) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3">
          <AppText color={color ?? 'primary'} className="font-bold">
            •
          </AppText>
          <AppText color={color} className="flex-1">
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );
}
