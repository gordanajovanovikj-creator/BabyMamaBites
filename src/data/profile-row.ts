import { profileSchema, type Profile } from '@/domain/profile';

/** Shape of the `profile` table row. Lists are stored as JSON text. */
export type ProfileRow = {
  baby_name: string | null;
  birth_date: string;
  due_date: string | null;
  feeding: string;
  allergens: string;
  diets: string;
  cooking_time: string;
};

export function profileToRow(profile: Profile): ProfileRow {
  return {
    baby_name: profile.babyName,
    birth_date: profile.birthDate,
    due_date: profile.dueDate,
    feeding: profile.feeding,
    allergens: JSON.stringify(profile.allergens),
    diets: JSON.stringify(profile.diets),
    cooking_time: profile.cookingTime,
  };
}

/** Parses a stored row, returning null if it is corrupt rather than crashing the app. */
export function rowToProfile(row: ProfileRow): Profile | null {
  try {
    const result = profileSchema.safeParse({
      babyName: row.baby_name ?? null,
      birthDate: row.birth_date,
      dueDate: row.due_date,
      feeding: row.feeding,
      allergens: JSON.parse(row.allergens),
      diets: JSON.parse(row.diets),
      cookingTime: row.cooking_time,
    });
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
