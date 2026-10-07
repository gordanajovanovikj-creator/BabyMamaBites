import type { ReactNode } from 'react';

import { profileSchema } from '@/domain/profile';

import type { ProfileStore } from './profile-store';
import { ProfileStoreContext } from './profile-store-context';

const KEY = 'mamababybites.profile';

/** Browser preview only: keeps the profile in localStorage instead of SQLite. */
const localStore: ProfileStore = {
  async load() {
    try {
      const raw = globalThis.localStorage?.getItem(KEY);
      if (!raw) return null;
      const result = profileSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },
  async save(profile) {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(profile));
  },
  async clear() {
    globalThis.localStorage?.removeItem(KEY);
  },
};

export function StorageProvider({ children }: { children: ReactNode }) {
  return <ProfileStoreContext.Provider value={localStore}>{children}</ProfileStoreContext.Provider>;
}
