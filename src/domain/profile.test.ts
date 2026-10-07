import { profileSchema, toggle, validateBirthDate, validateDueDate } from './profile';

describe('validateBirthDate', () => {
  it('accepts today and recent dates', () => {
    expect(validateBirthDate('2026-10-07', '2026-10-07')).toBeNull();
    expect(validateBirthDate('2025-01-01', '2026-10-07')).toBeNull();
  });
  it('rejects future dates', () => {
    expect(validateBirthDate('2026-10-08', '2026-10-07')).toBe('in-future');
  });
  it('rejects implausibly old dates', () => {
    expect(validateBirthDate('2015-01-01', '2026-10-07')).toBe('too-old');
  });
});

describe('validateDueDate', () => {
  it('accepts a due date months after an early birth', () => {
    expect(validateDueDate('2026-04-01', '2026-01-15')).toBeNull();
  });
  it('accepts a due date shortly before a late birth', () => {
    expect(validateDueDate('2026-01-05', '2026-01-15')).toBeNull();
  });
  it('rejects implausible gaps', () => {
    expect(validateDueDate('2026-09-01', '2026-01-15')).toBe('out-of-range');
    expect(validateDueDate('2025-10-01', '2026-01-15')).toBe('out-of-range');
  });
});

describe('profileSchema', () => {
  const valid = {
    birthDate: '2026-05-01',
    dueDate: null,
    feeding: 'breast',
    allergens: ['peanut'],
    diets: ['vegetarian'],
    cookingTime: 'minimal',
  };

  it('accepts a complete profile', () => {
    expect(profileSchema.parse(valid)).toEqual(valid);
  });
  it('rejects unknown options and bad dates', () => {
    expect(() => profileSchema.parse({ ...valid, allergens: ['chocolate'] })).toThrow();
    expect(() => profileSchema.parse({ ...valid, birthDate: '2026-02-30' })).toThrow();
  });
});

describe('toggle', () => {
  it('adds and removes without mutating', () => {
    const list = ['egg'] as const;
    expect(toggle(list, 'milk')).toEqual(['egg', 'milk']);
    expect(toggle(list, 'egg')).toEqual([]);
    expect(list).toEqual(['egg']);
  });
});
