import type { Profile } from '@/domain/profile';

import { profileToRow, rowToProfile } from './profile-row';

const profile: Profile = {
  babyName: 'Mila',
  birthDate: '2026-05-01',
  dueDate: '2026-06-10',
  feeding: 'mixed',
  allergens: ['egg', 'sesame'],
  diets: ['halal'],
  cookingTime: 'short',
  helpTopics: ['nutrition'],
  solidsApproach: 'spoon',
};

describe('profile row mapping', () => {
  it('reads rows saved before baby names existed', () => {
    expect(rowToProfile({ ...profileToRow(profile), baby_name: null })?.babyName).toBeNull();
  });

  it('reads rows saved before help topics and solids approach existed', () => {
    const old = rowToProfile({ ...profileToRow(profile), help_topics: null, solids_approach: null });
    expect(old?.helpTopics).toEqual([]);
    expect(old?.solidsApproach).toBeNull();
  });

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
