import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { usePalette } from '@/theme/use-palette';

import { appTabs } from './tabs';

/** Native iOS/Android tab bar: system-sized targets, VoiceOver and Dynamic Type for free. */
export function AppTabs() {
  const palette = usePalette();

  return (
    <NativeTabs
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
