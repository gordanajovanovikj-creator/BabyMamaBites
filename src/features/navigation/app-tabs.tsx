import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { usePalette } from '@/theme/use-palette';

import { appTabs } from './tabs';

/**
 * Native iOS/Android tab bar: system-sized targets, VoiceOver and Dynamic Type for free.
 * On iOS 26 the system draws it in Liquid Glass (the background color only applies on
 * iOS 18 and earlier), and it shrinks while scrolling down to give food photos more room.
 */
export function AppTabs() {
  const palette = usePalette();

  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      backgroundColor={palette.surface}
      tintColor={palette.primary}
      labelStyle={{ selected: { color: palette.primary } }}
    >
      {appTabs.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label>{tab.label}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={{ default: tab.sf, selected: tab.sfSelected }} md={tab.md} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
