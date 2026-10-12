import { useState, type ReactNode } from 'react';
import { ScrollView, View, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';

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
  /**
   * Stays pinned to the top while the content scrolls (title, tabs). With
   * `edgeToEdgeTop` it must add the top safe-area inset itself.
   */
  stickyHeader?: ReactNode;
  /** Floats over the content and doesn't scroll, e.g. a back button over a hero photo. */
  overlay?: ReactNode;
  className?: string;
};

/** Standard screen container: warm background, comfortable padding, safe-area aware. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edgeToEdgeTop = false,
  stickyHeader,
  overlay,
  className,
}: ScreenProps) {
  // A hairline under the pinned header once content slides beneath it.
  const [scrolled, setScrolled] = useState(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = e.nativeEvent.contentOffset.y > 4;
    if (next !== scrolled) setScrolled(next);
  };
  if (!scroll) {
    return <View className={cn('flex-1 bg-canvas', padded && 'px-5', className)}>{children}</View>;
  }
  const scrollView = (
    <ScrollView
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior={edgeToEdgeTop ? 'never' : 'automatic'}
      contentContainerClassName={cn('gap-4 pb-12', padded && 'px-5 pt-4', className)}
      stickyHeaderIndices={stickyHeader ? [0] : undefined}
      onScroll={stickyHeader ? onScroll : undefined}
      scrollEventThrottle={stickyHeader ? 16 : undefined}
    >
      {stickyHeader ? (
        <View className={cn('bg-canvas pb-3', scrolled && 'border-b border-border')}>
          {stickyHeader}
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
  if (!overlay) return scrollView;
  return (
    <View className="flex-1 bg-canvas">
      {scrollView}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {overlay}
      </View>
    </View>
  );
}
