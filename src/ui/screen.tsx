import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { cn } from './cn';

export type ScreenProps = {
  children: ReactNode;
  /** Set false for screens that manage their own scrolling (e.g. lists). */
  scroll?: boolean;
  /** Set false for full-bleed layouts that manage their own side padding. */
  padded?: boolean;
  /**
   * Let content run under the status bar (the first child must then add the
   * top safe-area inset itself), for a hero that fills the top of the screen.
   */
  edgeToEdgeTop?: boolean;
  className?: string;
};

/** Standard screen container: warm background, comfortable padding, safe-area aware. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edgeToEdgeTop = false,
  className,
}: ScreenProps) {
  if (!scroll) {
    return <View className={cn('flex-1 bg-canvas', padded && 'px-5', className)}>{children}</View>;
  }
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior={edgeToEdgeTop ? 'never' : 'automatic'}
      contentContainerClassName={cn('gap-4 pb-12', padded && 'px-5 pt-4', className)}
    >
      {children}
    </ScrollView>
  );
}
