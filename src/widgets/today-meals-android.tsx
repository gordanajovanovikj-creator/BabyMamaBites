import { FlexWidget, TextWidget } from 'react-native-android-widget';

import type { TodayWidgetProps } from '@/domain/widget';

// Widgets draw outside the app's theme, so the app's colors are written out here:
// canvas, ink, ink-muted, primary green and the hairline border.
const colors = {
  canvas: '#FFFFFF',
  ink: '#2C2A25',
  muted: '#6A655B',
  primary: '#487549',
  border: '#E9E3D8',
} as const;

/**
 * "Today's meals" home screen widget (Android): the same content as the iPhone widget,
 * as a white rounded card. Tapping it opens the app.
 */
export function TodayMealsAndroid({ props, small }: { props: TodayWidgetProps; small: boolean }) {
  const meals: [string, string][] = [
    ['Breakfast', props.breakfast],
    ['Lunch', props.lunch],
    ['Dinner', props.dinner],
  ];
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel={`${props.heading}. ${meals.map(([l, t]) => `${l}: ${t}`).join('. ')}`}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGap: small ? 4 : 6,
        backgroundColor: colors.canvas,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
      }}
    >
      <TextWidget
        text={props.heading}
        maxLines={1}
        truncate="END"
        style={{ fontSize: 13, fontWeight: 'bold', color: colors.primary }}
      />
      {meals.map(([label, title]) =>
        small ? (
          <FlexWidget key={label} style={{ flexDirection: 'column', width: 'match_parent' }}>
            <TextWidget text={label} style={{ fontSize: 10, color: colors.muted }} />
            <TextWidget
              text={title}
              maxLines={1}
              truncate="END"
              style={{ fontSize: 13, fontWeight: '600', color: colors.ink }}
            />
          </FlexWidget>
        ) : (
          <FlexWidget
            key={label}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: 'match_parent',
              flexGap: 8,
            }}
          >
            <TextWidget text={label} style={{ fontSize: 13, color: colors.muted }} />
            <TextWidget
              text={title}
              maxLines={1}
              truncate="END"
              style={{ fontSize: 15, fontWeight: '600', color: colors.ink, textAlign: 'right' }}
            />
          </FlexWidget>
        ),
      )}
    </FlexWidget>
  );
}

/** Narrow widgets stack each label over its meal; wider ones put them side by side. */
export const isSmallWidget = (widthDp: number) => widthDp < 250;
