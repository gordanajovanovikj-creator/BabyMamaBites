import type { Profile } from '@/domain/profile';

import { profileToRow, rowToProfile } from './profile-row';

const profile: Profile = {
  birthDate: '2026-05-01',
  dueDate: '2026-06-10',
  feeding: 'mixed',
  allergens: ['egg', 'sesame'],
  diets: ['halal'],
  cookingTime: 'short',
};

describe('profile row mapping', () => {
  it('round-trips a profile', () => {
    expect(rowToProfile(profileToRow(profile))).toEqual(profile);
  });

  it('returns null for corrupt JSON instead of throwing', () => {
    expect(rowToProfile({ ...profileToRow(profile), allergens: '{oops' })).toBeNull();
  });

  it('returns null when stored values are no longer valid', () => {
    expect(rowToProfile({ ...profileToRow(profile), feeding: 'unknown' })).toBeNull();
  });
});
