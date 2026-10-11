import { Pressable, View } from 'react-native';

import { AppText, SymbolIcon } from '@/ui';

export type ArrowButtonProps = {
  label: string;
  onPress: () => void;
};

/** Tall pill button with a white arrow circle on the right, for the welcome screen. */
export function ArrowButton({ label, onPress }: ArrowButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="min-h-16 flex-row items-center rounded-full bg-primary py-2 pl-14 pr-2 active:opacity-80"
    >
      <AppText
        variant="label"
        color="on-primary"
        size="lg"
        className="flex-1 text-center font-bold"
      >
        {label}
      </AppText>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-surface">
        <SymbolIcon icon="chevron.right" emoji="›" size={20} />
      </View>
    </Pressable>
  );
}
