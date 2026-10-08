# Recipes: safety and content review

> Reviewed file: `src/content/recipes.json` (24 recipes, 16 categories). Review date: 2026-10-08.
>
> This was an **automated check** against official US source texts (CDC, AAP/HealthyChildren.org,
> FDA/EPA, with WHO for context). It is **not a professional sign-off**. Every recipe still has
> `reviewStatus: "placeholder"` and the `[PLACEHOLDER - needs expert review]` marker, and still
> needs review by a registered dietitian before it ships as reviewed.

## Sources used

| Key          | Source                                                                                  |
| ------------ | --------------------------------------------------------------------------------------- |
| CDC-choking  | CDC, Choking Hazards (USDA WIC list of foods to avoid)                                  |
| CDC-solids   | CDC, When, What, and How to Introduce Solid Foods (preparation tips)                    |
| CDC-avoid    | CDC, Foods and Drinks to Avoid or Limit (honey, added sugar, salt, unpasteurized foods) |
| CDC-maternal | CDC, Maternal Diet (breastfeeding: seafood, caffeine, vegan/vegetarian)                 |
| AAP-choking  | AAP/HealthyChildren.org, Choking Prevention                                             |
| FDA-fish     | FDA/EPA, Advice About Eating Fish (Best Choices / Good Choices)                         |

Note: `aap-bf-diet.txt` was empty (download failed), so the AAP breastfeeding-diet page was not used.
Safe minimum internal temperatures (poultry 165°F, fish 145°F, eggs firm) follow USDA guidance as given
in the review brief; no USDA page was among the downloaded sources.

## What was checked, with no problems found anywhere

- **Milk-supply, "boosting", detox or cure claims:** none found. The existing test that bans
  "milk supply", "boost milk", "increase milk", "lactation" and "galactagogue" still passes.
- **Alcohol (incl. cooking wine), raw or undercooked eggs/meat/fish, unpasteurized dairy or juice,
  honey:** none in any recipe. Egg recipes already cook eggs fully (one wording improved, below).
- **Caffeine:** only cocoa in `pb-banana-shake`, and its tip already notes it (CDC-maternal lists
  chocolate as a caffeine source). `warm-spiced-milk` is correctly called caffeine-free.
- **Fish:** only canned light tuna and salmon, both FDA "Best Choices". No "Choices to Avoid" fish.
- **Allergen tags (US top 9):** all correct for the ingredients as written (hummus = sesame, soy sauce =
  soy + wheat, Parmesan/cheese/yogurt/milk = milk, tortillas/bread/pasta/crackers = wheat, tuna/salmon = fish).
- **Diet tags:** consistent (no vegan recipe has milk/egg/fish; no gluten-free recipe has wheat).
- **Cow's milk as a drink for babies:** milk drinks are for mom only; no baby serving suggested.

## Findings and changes

| Recipe                  | Issue                                                                                                                              | Source                                                                                                                     | Change made                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `egg-muffin-cups`       | "Until set in the middle" didn't make clear the eggs must be fully cooked. Baby-sharing tip didn't mention texture.                | Brief (eggs until firm); CDC-solids ("cut soft food into small pieces or thin slices")                                     | Step now says "until the eggs are firm and fully set in the middle, with no runny egg". Tip adds "cut a baby's portion into small pieces or thin slices".                                                 |
| `chicken-quinoa-jars`   | Cooked chicken listed with no safe temperature.                                                                                    | USDA poultry 165°F (brief)                                                                                                 | Ingredient now "cooked chicken breast (cooked to 165°F)".                                                                                                                                                 |
| `white-bean-tuna-salad` | Pepper used in a step but missing from ingredients. Tip gave no weekly amount and no warning if someone swaps in albacore.         | FDA-fish; CDC-maternal                                                                                                     | Added "Pepper" to ingredients. Tip now gives the FDA amount while breastfeeding (2 to 3 servings of 4 oz a week from Best Choices) and notes albacore is a "Good Choice" (no more than 1 serving a week). |
| `sheet-pan-salmon`      | Tip gave no weekly amount. Family-friendly recipe had no note on fish bones for little ones. UK wording ("tray", "washing up").    | FDA-fish; CDC-choking ("bones in meat or fish"); CDC-solids (remove skin and bones)                                        | Added FDA weekly amount; added "remove the skin, check carefully for bones, and flake the fish". "Tray" → "sheet pan"/"pan"; "washing up" → "cleanup".                                                    |
| `chicken-stir-fry`      | "Until cooked through" with no temperature.                                                                                        | USDA poultry 165°F (brief)                                                                                                 | Now "until no pink remains and it reaches 165°F".                                                                                                                                                         |
| `turkey-chili`          | Ground turkey with no temperature. Family-friendly, but whole beans and regular canned goods (salt) not addressed for little ones. | USDA poultry 165°F (brief); CDC-choking ("whole beans"); CDC-avoid (choose low-sodium/no-salt-added canned foods)          | Step now says "until no pink remains and it reaches 165°F". New tip: mash the beans and choose low-sodium or no-salt-added canned beans and tomatoes when sharing with a baby or toddler.                 |
| `black-bean-quesadilla` | Family-friendly, contains whole corn kernels.                                                                                      | CDC-choking ("cooked or raw whole corn kernels")                                                                           | New tip: mash the corn with the beans or leave it out for a baby or toddler.                                                                                                                              |
| `chickpea-curry`        | Family-friendly, whole chickpeas. UK term "chopped tomatoes".                                                                      | CDC-choking ("whole beans")                                                                                                | New tip: mash the chickpeas for a baby or toddler. "Chopped tomatoes" → "diced tomatoes".                                                                                                                 |
| `slow-cooker-chicken`   | Family-friendly; meat texture for little ones not addressed.                                                                       | CDC-choking / AAP-choking (tough or large chunks of meat)                                                                  | New tip: shred finely for a baby or toddler.                                                                                                                                                              |
| `lentil-soup`           | Tip covered broth sodium but not canned tomatoes. UK term "chopped tomatoes".                                                      | CDC-avoid (low-sodium or no-salt-added canned foods)                                                                       | Tip now covers broth and tomatoes. "Chopped" → "diced" tomatoes.                                                                                                                                          |
| `snack-plate`           | Toddler tip only covered grapes; plate also has cheese, raw baby carrots and crackers.                                             | CDC-choking (grapes, hard raw vegetables, large chunks of cheese, crackers with seeds or whole grain kernels); AAP-choking | Tip now covers grapes (small pieces), cheese (thin slices, not chunks), carrots (cooked soft) and crackers.                                                                                               |
| `energy-bites`          | "Not for babies" understated it: AAP advises keeping high-risk foods away until about age 4.                                       | AAP-choking; CDC-choking (chunks of nut butter)                                                                            | Tip now "Not for babies or young children".                                                                                                                                                               |
| `apple-pb`              | No warning, though raw apple pieces and thick peanut butter are listed choking hazards.                                            | CDC-choking; AAP-choking                                                                                                   | New tip: not for babies or young children as is.                                                                                                                                                          |
| `one-pot-pasta`         | Tagged halal and kosher, but the rennet caveat only mentioned vegetarian.                                                          | Labeling (diet-tag accuracy)                                                                                               | Tip now says Parmesan may not be vegetarian, halal or kosher; check the label.                                                                                                                            |
| `warm-spiced-milk`      | "Soothing" reads as a mild health claim.                                                                                           | Brief (no unsupported health claims)                                                                                       | "A soothing" → "A cozy".                                                                                                                                                                                  |
| Category `one-pot`      | UK wording "washing up".                                                                                                           | US English rule (CLAUDE.md)                                                                                                | "less washing up" → "fewer dishes".                                                                                                                                                                       |

## Flagged for a human reviewer (not changed)

| Recipe                                                                                                   | Question                                                                                                                                                                                   | Why it needs judgment                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `slow-cooker-chicken`                                                                                    | Should the recipe say the chicken must be fully thawed before it goes in the slow cooker?                                                                                                  | Standard USDA slow-cooker advice, but no USDA page was among the downloaded sources.                                     |
| `chicken-quinoa-jars`                                                                                    | Tip says "Halal and kosher depend on the chicken", but `kosher` isn't in its diet tags. The other meat recipes tag halal only.                                                             | Decide whether meat recipes should be tagged kosher (with the label caveat) or the tip should mention halal only.        |
| `chickpea-curry`                                                                                         | Coconut is not tagged as an allergen.                                                                                                                                                      | Coconut is not in the US top 9 as the app models it; a reviewer may still want a coconut note for families who avoid it. |
| `hummus-wrap`, `snack-plate`, `energy-bites`, `breakfast-burritos`, `lentil-soup`, `slow-cooker-chicken` | Store-bought items (tortillas, crackers, chocolate chips, broth, salsa, hummus) can contain extra allergens (milk, soy, sesame) or animal ingredients that affect vegan/halal/kosher tags. | Brand-dependent; consider a general "check the label" note in the recipe screen.                                         |
| `chicken-quinoa-jars`, `egg-muffin-cups`, `baked-oatmeal`, `overnight-oats`, `white-bean-tuna-salad`     | Stated fridge times (2 to 4 days) and freezer times (3 months) weren't checked.                                                                                                            | No food-storage source was among the downloaded texts.                                                                   |
| `egg-muffin-cups`, `one-pot-pasta`, `black-bean-quesadilla`, `breakfast-burritos`                        | When shared with a baby, cheese and Parmesan add sodium.                                                                                                                                   | CDC-avoid warns against high-salt foods but gives no amount for cheese; a dietitian should decide whether to add a note. |
| `pb-banana-shake`, `yogurt-parfait`, `egg-muffin-cups` and others                                        | Placed in the `high-protein` category.                                                                                                                                                     | The category is a label, not a numeric claim; confirm the threshold the app wants.                                       |
| Tests                                                                                                    | `src/content/us-english.test.ts` doesn't scan `recipes.json` (that's how "washing up" got through).                                                                                        | Consider adding `recipes` to its bundles. Not changed here.                                                              |

## Recipes with no issues found

`overnight-oats`, `banana-oat-smoothie`, `pb-banana-shake`, `nut-butter-porridge`, `yogurt-parfait`,
`avocado-egg-toast`, `breakfast-burritos`, `baked-oatmeal`, `hummus-wrap` (aside from the general
store-bought label note above).

## Storage times (checked against the USDA chart)

Source: FoodSafety.gov (USDA/HHS) **Cold Food Storage Chart**, last reviewed 2023-09-19.
The live site blocks automated access, so it was read through the Internet Archive copy.
The chart's freezer times are for quality; food kept frozen at 0°F stays safe indefinitely,
so the recipes say "for best quality".

| Recipe | Chart row used | Fridge | Freezer |
| --- | --- | --- | --- |
| egg-muffin-cups | Casseroles with eggs / quiche | 3–4 days (was "up to 4 days") | 2–3 months (was "freeze") |
| breakfast-burritos | Casseroles with eggs | 3–4 days (new) | 2–3 months (was "freeze") |
| baked-oatmeal | Casseroles with eggs | 3–4 days (was 4 days) | 2–3 months (was "freezes well") |
| chicken-quinoa-jars | Chicken salad | 3–4 days (was up to 4) | Doesn't freeze well (new) |
| white-bean-tuna-salad | Tuna salad | 3–4 days (was 2 days) | Doesn't freeze well (new) |
| lentil-soup | Soups and stews | 3–4 days (new) | 2–3 months (was 3 months) |
| turkey-chili | Soups and stews | 3–4 days (new) | 2–3 months (was 3 months) |
| chickpea-curry | Soups and stews | 3–4 days (new) | 2–3 months (new) |
| slow-cooker-chicken | Leftovers: cooked poultry | 3–4 days (new) | 2–6 months (was "freeze") |
| sheet-pan-salmon | Leftovers: cooked fish | 3–4 days (new) | n/a |
| chicken-stir-fry | Leftovers: cooked poultry | 3–4 days (new) | n/a |

**Not on the chart, left as they were for the reviewer:** `overnight-oats` (fridge up to
3 days) and `energy-bites` (fridge up to a week, or freeze). USDA's FoodKeeper app covers
these, but its data couldn't be downloaded here.
