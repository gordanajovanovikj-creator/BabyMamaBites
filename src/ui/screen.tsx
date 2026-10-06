import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { cn } from './cn';

export type ScreenProps = {
  children: ReactNode;
  /** Set false for screens that manage their own scrolling (e.g. lists). */
  scroll?: boolean;
  className?: string;
};

/** Standard screen container: warm background, comfortable padding, safe-area aware. */
export function Screen({ children, scroll = true, className }: ScreenProps) {
  if (!scroll) {
    return <View className={cn('flex-1 bg-canvas px-5', className)}>{children}</View>;
  }
  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName={cn('gap-4 px-5 pb-12 pt-4', className)}
    >
      {children}
    </ScrollView>
  );
}
