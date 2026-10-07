/**
 * Ordered schema migrations. Append only: never edit a migration that has shipped.
 * The database's `user_version` records how many have been applied.
 */
export const migrations: string[] = [
  `CREATE TABLE IF NOT EXISTS profile (
     id INTEGER PRIMARY KEY CHECK (id = 1),
     birth_date TEXT NOT NULL,
     due_date TEXT,
     feeding TEXT NOT NULL,
     allergens TEXT NOT NULL,
     diets TEXT NOT NULL,
     cooking_time TEXT NOT NULL,
     updated_at TEXT NOT NULL
   );`,
  `ALTER TABLE profile ADD COLUMN baby_name TEXT;`,
];
