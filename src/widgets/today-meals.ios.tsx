import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { font, foregroundStyle, lineLimit, padding } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { TodayWidgetProps } from '@/domain/widget';

/**
 * "Today's meals" home screen widget (iOS). Runs in an isolated widget runtime:
 * no hooks, imports or module variables inside, and only SwiftUI components, so
 * the app's colors are written out here (ink, ink-muted and primary green).
 */
const TodayMeals = (props: TodayWidgetProps, environment: WidgetEnvironment) => {
  'widget';
  const small = environment.widgetFamily === 'systemSmall';
  return (
    <VStack alignment="leading" spacing={small ? 4 : 6} modifiers={[padding({ all: 2 })]}>
      <Text modifiers={[font({ weight: 'bold', size: 13 }), foregroundStyle('#487549')]}>
        {props.heading}
      </Text>
      {[
        ['Breakfast', props.breakfast],
        ['Lunch', props.lunch],
        ['Dinner', props.dinner],
      ].map(([label, title]) =>
        small ? (
          <VStack key={label} alignment="leading" spacing={0}>
            <Text modifiers={[font({ size: 10 }), foregroundStyle('#6A655B')]}>{label}</Text>
            <Text
              modifiers={[
                font({ weight: 'semibold', size: 13 }),
                foregroundStyle('#2C2A25'),
                lineLimit(1),
              ]}
            >
              {title}
            </Text>
          </VStack>
        ) : (
          <HStack key={label} spacing={8}>
            <Text modifiers={[font({ size: 13 }), foregroundStyle('#6A655B')]}>{label}</Text>
            <Spacer />
            <Text
              modifiers={[
                font({ weight: 'semibold', size: 15 }),
                foregroundStyle('#2C2A25'),
                lineLimit(1),
              ]}
            >
              {title}
            </Text>
          </HStack>
        ),
      )}
    </VStack>
  );
};

export const todayMealsWidget = createWidget('TodayMeals', TodayMeals);
