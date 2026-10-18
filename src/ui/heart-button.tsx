import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { shadows } from '@/theme/colors';
import { usePalette } from '@/theme/use-palette';

import { cn } from './cn';
import { useFlatButtons } from './flat-buttons';
import { haptics } from './haptics';

export type HeartButtonProps = {
  saved: boolean;
  onPress(): void;
  /** Name of the thing being saved, for VoiceOver. */
  label: string;
  className?: string;
};

/** Round 44pt save/unsave button. Saving gives a soft tap and a little "pop". */
export function HeartButton({ saved, onPress, label, className }: HeartButtonProps) {
  const palette = usePalette();
  const flat = useFlatButtons();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const press = () => {
    if (!saved) {
      haptics.tap();
      if (!reduceMotion) {
        scale.set(
          withSequence(
            withTiming(1.3, { duration: 110 }),
            withSpring(1, { damping: 8, stiffness: 220 }),
          ),
        );
      }
    }
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `Remove ${label} from favorites` : `Save ${label} to favorites`}
      onPress={press}
      hitSlop={8}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full bg-surface active:opacity-70',
        className,
      )}
      style={flat ? undefined : { boxShadow: shadows.floatTight }}
    >
      <Animated.View style={heartStyle}>
        <SymbolView
          name={saved ? 'heart.fill' : 'heart'}
          size={22}
          tintColor={palette.primary}
          fallback={
            <Text style={{ fontSize: 20, color: palette.primary }}>{saved ? '♥' : '♡'}</Text>
          }
        />
      </Animated.View>
    </Pressable>
  );
}
