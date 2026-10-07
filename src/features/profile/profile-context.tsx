import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useProfileStore } from '@/data/profile-store-context';
import type { Profile } from '@/domain/profile';

type ProfileState = {
  /** False until the stored profile has been read. */
  ready: boolean;
  profile: Profile | null;
  saveProfile(profile: Profile): Promise<void>;
  clearProfile(): Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const store = useProfileStore();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let cancelled = false;
    store
      .load()
      .catch(() => null)
      .then((loaded) => {
        if (cancelled) return;
        setProfile(loaded);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const saveProfile = useCallback(
    async (next: Profile) => {
      await store.save(next);
      setProfile(next);
    },
    [store],
  );

  const clearProfile = useCallback(async () => {
    await store.clear();
    setProfile(null);
  }, [store]);

  const value = useMemo(
    () => ({ ready, profile, saveProfile, clearProfile }),
    [ready, profile, saveProfile, clearProfile],
  );
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileState {
  const value = useContext(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside <ProfileProvider>');
  return value;
}
