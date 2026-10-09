import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { getPlanWeek, planWeeks } from '@/content/solids-plan';
import { useSettingsStore } from '@/data/stores-context';
import { today } from '@/domain/dates';
import {
  anyReminderOn,
  defaultReminderSettings,
  planReminders,
  type ReminderSettings,
} from '@/domain/reminders';
import { solidsStartDate } from '@/domain/stage';
import { usePlanner } from '@/features/planner/planner-context';
import { useProfile } from '@/features/profile/profile-context';

import { ensurePermission, syncReminders } from './notifications';

type RemindersState = {
  settings: ReminderSettings;
  /** Saves settings. Returns false if notifications are blocked in iOS Settings. */
  update(next: ReminderSettings): Promise<boolean>;
};

const RemindersContext = createContext<RemindersState | null>(null);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const store = useSettingsStore();
  const { profile } = useProfile();
  const { freezer } = usePlanner();
  const [settings, setSettings] = useState<ReminderSettings>(defaultReminderSettings);
  const [loaded, setLoaded] = useState(false);
  const [foreground, setForeground] = useState(0);

  useEffect(() => {
    let cancelled = false;
    store
      .loadReminders()
      .catch(() => defaultReminderSettings)
      .then((s) => {
        if (cancelled) return;
        setSettings(s);
        setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  // Re-plan when the app comes back, so one-off dates stay current.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setForeground((n) => n + 1);
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const now = today();
    const planned = profile
      ? planReminders(settings, {
          today: now,
          freezer,
          solidsStart: solidsStartDate(profile, now),
          planWeeks: planWeeks.length,
          weekTitle: (w) => getPlanWeek(w)?.title,
        })
      : [];
    syncReminders(planned).catch(() => {});
  }, [loaded, settings, freezer, profile, foreground]);

  const update = useCallback(
    async (next: ReminderSettings) => {
      if (anyReminderOn(next) && !(await ensurePermission())) return false;
      await store.saveReminders(next);
      setSettings(next);
      return true;
    },
    [store],
  );

  const value = useMemo(() => ({ settings, update }), [settings, update]);
  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders(): RemindersState {
  const value = useContext(RemindersContext);
  if (!value) throw new Error('useReminders must be used inside <RemindersProvider>');
  return value;
}
