import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  ScrollView,
  useWindowDimensions,
  View,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  /**
   * Pinned to the bottom, in thumb reach, for the screen's main actions (e.g.
   * "Add to meal plan"). Sits above the home indicator; content scrolls behind it.
   */
  footer?: ReactNode;
  className?: string;
};

/** How far down the page (pt) the overlay counts as "past the hero picture". */
const PAST_HERO_AT = 260;
const PastHeroContext = createContext(false);

/**
 * True once the page has scrolled past its hero picture. Read it inside a Screen
 * `overlay` (e.g. to show the title in a solid top bar).
 */
export function useScrolledPastHero(): boolean {
  return useContext(PastHeroContext);
}

/** Standard screen container: warm background, comfortable padding, safe-area aware. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edgeToEdgeTop = false,
  stickyHeader,
  overlay,
  footer,
  className,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  // With large Dynamic Type, side-by-side footer buttons get cramped, so stack them.
  const stackFooter = useWindowDimensions().fontScale >= 1.3;
  // A hairline under the pinned header once content slides beneath it.
  const [scrolled, setScrolled] = useState(false);
  // For an overlay over a hero picture: whether the picture has scrolled away.
  const [pastHero, setPastHero] = useState(false);
  const tracksScroll = !!stickyHeader || !!overlay;
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const next = y > 4;
    if (next !== scrolled) setScrolled(next);
    const past = y > PAST_HERO_AT;
    if (past !== pastHero) setPastHero(past);
  };
  if (!scroll) {
    return <View className={cn('flex-1 bg-canvas', padded && 'px-5', className)}>{children}</View>;
  }
  const scrollView = (
    <ScrollView
      className="flex-1 bg-canvas"
      contentInsetAdjustmentBehavior={edgeToEdgeTop ? 'never' : 'automatic'}
      // Defaults only where the screen doesn't set its own (`cn` doesn't merge classes).
      contentContainerClassName={cn(
        !/(^|\s)gap-/.test(className ?? '') && 'gap-4',
        'pb-12',
        padded && 'px-5',
        padded && !/(^|\s)pt-/.test(className ?? '') && 'pt-4',
        className,
      )}
      stickyHeaderIndices={stickyHeader ? [0] : undefined}
      onScroll={tracksScroll ? onScroll : undefined}
      scrollEventThrottle={tracksScroll ? 16 : undefined}
    >
      {stickyHeader ? (
        <View className={cn('bg-canvas pb-3', scrolled && 'border-b border-border')}>
          {stickyHeader}
        </View>
      ) : null}
      {children}
    </ScrollView>
  );
  if (!overlay && !footer) return scrollView;
  return (
    <View className="flex-1 bg-canvas">
      {scrollView}
      {footer ? (
        <View
          className={cn(
            'gap-3 border-t border-border bg-canvas px-5 pt-3',
            stackFooter ? 'flex-col-reverse' : 'flex-row',
          )}
          style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
          {footer}
        </View>
      ) : null}
      {overlay ? (
        <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <PastHeroContext.Provider value={pastHero}>{overlay}</PastHeroContext.Provider>
        </View>
      ) : null}
    </View>
  );
}
