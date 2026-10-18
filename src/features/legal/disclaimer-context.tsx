import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useSettingsStore } from '@/data/stores-context';
import { today } from '@/domain/dates';

type DisclaimerState = {
  /** False until the saved answer has loaded. */
  ready: boolean;
  /** The date the medical disclaimer was accepted on this phone, or null. */
  acceptedOn: string | null;
  accept(): Promise<void>;
};

const DisclaimerContext = createContext<DisclaimerState | null>(null);

/** Whether the medical disclaimer has been accepted (saved on this phone with the date). */
export function DisclaimerProvider({ children }: { children: ReactNode }) {
  const store = useSettingsStore();
  const [ready, setReady] = useState(false);
  const [acceptedOn, setAcceptedOn] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .loadDisclaimerAccepted()
      .catch(() => null)
      .then((value) => {
        if (cancelled) return;
        setAcceptedOn(value);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const accept = useCallback(async () => {
    const on = today();
    setAcceptedOn(on);
    await store.saveDisclaimerAccepted(on).catch(() => {});
  }, [store]);

  const value = useMemo(() => ({ ready, acceptedOn, accept }), [ready, acceptedOn, accept]);
  return <DisclaimerContext.Provider value={value}>{children}</DisclaimerContext.Provider>;
}

export function useDisclaimer(): DisclaimerState {
  const state = useContext(DisclaimerContext);
  if (!state) throw new Error('useDisclaimer must be used inside <DisclaimerProvider>');
  return state;
}
