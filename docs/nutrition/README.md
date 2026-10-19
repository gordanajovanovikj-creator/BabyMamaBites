# Recipe nutrition

Each recipe page shows estimated nutrition per serving, from `src/content/recipe-nutrition.json`.

## How the numbers are made

1. Every ingredient line is matched to a food in USDA FoodData Central (SR Legacy, 2018) and
   converted to grams using USDA household portions, or standard US kitchen weights when USDA
   has none. `ingredient-mapping.json` lists each line, the USDA food, the grams and the
   assumption made, so anyone can check or correct it.
2. The nutrients are added up and divided by the recipe's servings.
3. Water, ice and cooking spray count as zero. "A or B" uses A; ranges use the midpoint.

## What's shown

- Grown-up recipes and one-pot family meals: calories, protein, carbs, fiber, fat, sodium.
- Baby and toddler recipes: iron, protein and sodium per baby portion (no calories; US
  pediatric guidance doesn't ask parents to count a baby's calories).

## Known limits

- SR Legacy has no oat milk, brewer's yeast, matcha, acai, gnocchi, cannellini or several
  low-sodium products; the closest generic food stands in (see the notes in the mapping).
- Brands, produce sizes and portions vary, so the numbers are estimates for general
  information only. They are not reviewed by a dietitian.

To change a mapping, edit the batch file in the scratch workflow or `ingredient-mapping.json`
and recompute the totals.
