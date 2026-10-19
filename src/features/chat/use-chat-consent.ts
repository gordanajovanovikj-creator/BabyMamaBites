import { useCallback, useEffect, useState } from 'react';

import { useSettingsStore } from '@/data/stores-context';
import { today } from '@/domain/dates';

/**
 * Whether the parent agreed to send Ask questions to the AI provider (asked once, before
 * the first question). `null` while loading.
 */
export function useChatConsent(): { consented: boolean | null; accept(): Promise<void> } {
  const store = useSettingsStore();
  const [consented, setConsented] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .loadChatConsent()
      .catch(() => null)
      .then((on) => {
        if (!cancelled) setConsented(on !== null);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const accept = useCallback(async () => {
    await store.saveChatConsent(today()).catch(() => {});
    setConsented(true);
  }, [store]);

  return { consented, accept };
}
