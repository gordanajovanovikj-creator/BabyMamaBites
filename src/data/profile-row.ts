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
  /** JSON list; null in rows saved before this column existed. */
  help_topics: string | null;
  solids_approach: string | null;
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
    help_topics: JSON.stringify(profile.helpTopics),
    solids_approach: profile.solidsApproach,
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
      helpTopics: row.help_topics ? JSON.parse(row.help_topics) : [],
      solidsApproach: row.solids_approach ?? null,
    });
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
