import { Tabs } from 'expo-router/js-tabs';

import { usePalette } from '@/theme/use-palette';

import { appTabs } from './tabs';

/** Web fallback (used for quick previews only; iOS is the target platform). */
export function AppTabs() {
  const palette = usePalette();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.inkMuted,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
      }}
    >
      {appTabs.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
      ))}
    </Tabs>
  );
}
