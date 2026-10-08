import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Text, View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

export type TileIllustrationProps = {
  icon: string;
  emoji: string;
  /** Set on white tiles so the disc stays visible. */
  onWhite?: boolean;
};

/** Big icon on a soft white disc with a little confetti, Flo-style. */
export function TileIllustration({ icon, emoji, onWhite = false }: TileIllustrationProps) {
  const palette = usePalette();
  return (
    <View
      className="h-24 items-center justify-center"
      importantForAccessibility="no-hide-descendants"
    >
      <View className="absolute left-3 top-2 h-3 w-3 rounded-full bg-surface opacity-70" />
      <View className="absolute bottom-3 right-4 h-4 w-4 rounded-full bg-primary opacity-40" />
      <View className="absolute right-8 top-1 h-2 w-2 rounded-full bg-primary opacity-60" />
      <View
        className={
          onWhite
            ? 'h-20 w-20 items-center justify-center rounded-full bg-surface-muted'
            : 'h-20 w-20 items-center justify-center rounded-full bg-surface'
        }
      >
        <SymbolView
          name={icon as SymbolViewProps['name']}
          size={40}
          tintColor={palette.primary}
          fallback={<Text style={{ fontSize: 40, lineHeight: 48 }}>{emoji}</Text>}
        />
      </View>
    </View>
  );
}
