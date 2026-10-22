import { router } from 'expo-router';
import { useEffect } from 'react';

import { useSettingsStore } from '@/data/stores-context';
import { AppTabs } from '@/features/navigation/app-tabs';

export default function TabsLayout() {
  const store = useSettingsStore();

  // The app tour opens by itself the first time the tabs appear, after setup.
  useEffect(() => {
    let cancelled = false;
    store
      .loadTourSeen()
      .catch(() => 'unknown')
      .then((seen) => {
        if (!cancelled && seen === null) router.push('/tour');
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  return <AppTabs />;
}
