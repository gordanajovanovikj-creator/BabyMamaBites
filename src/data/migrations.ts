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
  `CREATE TABLE IF NOT EXISTS meal_plan (
     date TEXT PRIMARY KEY NOT NULL,
     recipe_id TEXT NOT NULL,
     updated_at TEXT NOT NULL
   );
   CREATE TABLE IF NOT EXISTS freezer_item (
     id TEXT PRIMARY KEY NOT NULL,
     name TEXT NOT NULL,
     cubes INTEGER NOT NULL,
     frozen_on TEXT NOT NULL,
     created_at TEXT NOT NULL
   );`,
  `CREATE TABLE IF NOT EXISTS meal_slot (
     date TEXT NOT NULL,
     slot TEXT NOT NULL,
     recipe_id TEXT NOT NULL,
     updated_at TEXT NOT NULL,
     PRIMARY KEY (date, slot)
   );
   INSERT OR IGNORE INTO meal_slot (date, slot, recipe_id, updated_at)
     SELECT date, 'lunch', recipe_id, updated_at FROM meal_plan;
   DROP TABLE IF EXISTS meal_plan;`,
  `CREATE TABLE IF NOT EXISTS app_setting (
     key TEXT PRIMARY KEY NOT NULL,
     value TEXT NOT NULL
   );`,
  `ALTER TABLE profile ADD COLUMN help_topics TEXT;
   ALTER TABLE profile ADD COLUMN solids_approach TEXT;`,
  `CREATE TABLE IF NOT EXISTS calendar_entry (
     id TEXT PRIMARY KEY NOT NULL,
     date TEXT NOT NULL,
     kind TEXT NOT NULL,
     text TEXT NOT NULL,
     time TEXT,
     created_at TEXT NOT NULL
   );
   CREATE INDEX IF NOT EXISTS calendar_entry_date ON calendar_entry (date);`,
  `ALTER TABLE calendar_entry ADD COLUMN remind INTEGER NOT NULL DEFAULT 0;`,
];
