import { createContext, useContext } from 'react';

import type { ProfileStore } from './profile-store';

export const ProfileStoreContext = createContext<ProfileStore | null>(null);

export function useProfileStore(): ProfileStore {
  const store = useContext(ProfileStoreContext);
  if (!store) throw new Error('useProfileStore must be used inside <StorageProvider>');
  return store;
}
