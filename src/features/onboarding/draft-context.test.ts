import type { Profile } from '@/domain/profile';

import { draftFromProfile, draftToProfile } from './draft-context';

const profile: Profile = {
  birthDate: '2026-05-01',
  dueDate: '2026-06-10',
  feeding: 'breast',
  allergens: ['peanut'],
  diets: [],
  cookingTime: 'minimal',
};

describe('onboarding draft', () => {
  it('starts empty for a new user', () => {
    expect(draftToProfile(draftFromProfile(null))).toBeNull();
  });

  it('round-trips an existing profile (editing details)', () => {
    expect(draftToProfile(draftFromProfile(profile))).toEqual(profile);
  });

  it('drops the due date when "born early" is switched off', () => {
    const draft = { ...draftFromProfile(profile), bornEarly: false };
    expect(draftToProfile(draft)?.dueDate).toBeNull();
  });
});
