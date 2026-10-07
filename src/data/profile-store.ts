import type { Profile } from '@/domain/profile';

/** Where the profile lives. SQLite on devices; localStorage in the web preview. */
export type ProfileStore = {
  load(): Promise<Profile | null>;
  save(profile: Profile): Promise<void>;
  clear(): Promise<void>;
};
