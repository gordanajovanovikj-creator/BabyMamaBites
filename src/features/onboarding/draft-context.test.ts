import type { Profile } from '@/domain/profile';

import { draftFromProfile, draftToProfile } from './draft-context';

const profile: Profile = {
  babyName: 'Mila',
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

  it('trims the name and treats a blank name as none', () => {
    const base = draftFromProfile(profile);
    expect(draftToProfile({ ...base, babyName: '  Mila ' })?.babyName).toBe('Mila');
    expect(draftToProfile({ ...base, babyName: '   ' })?.babyName).toBeNull();
  });

  it('drops the due date when "born early" is switched off', () => {
    const draft = { ...draftFromProfile(profile), bornEarly: false };
    expect(draftToProfile(draft)?.dueDate).toBeNull();
  });
});
