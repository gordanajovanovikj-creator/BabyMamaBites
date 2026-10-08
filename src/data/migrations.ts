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
  `CREATE TABLE IF NOT EXISTS favorite_recipe (
     recipe_id TEXT PRIMARY KEY NOT NULL,
     created_at TEXT NOT NULL
   );`,
  `CREATE TABLE IF NOT EXISTS food_log (
     id TEXT PRIMARY KEY NOT NULL,
     date TEXT NOT NULL,
     food TEXT NOT NULL,
     allergen TEXT,
     is_new INTEGER NOT NULL,
     reaction TEXT NOT NULL,
     notes TEXT,
     created_at TEXT NOT NULL
   );
   CREATE INDEX IF NOT EXISTS food_log_date ON food_log (date DESC);`,
];
