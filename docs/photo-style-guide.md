# Photo style guide

How every photo in MamaBabyBites should look, so the app feels like one calm, premium
place and real food stays the focal point. Use this when picking stock photos
(Magnific, Pexels, Pixabay) or briefing a photographer.

## The look

- **Bright and natural.** Soft daylight, gentle shadows. No dark, moody or night
  backgrounds (black slate, navy, dark wood). Aim for an average brightness of 100 or
  more on a 0 to 255 scale; anything under 90 reads as "dark" next to the app's white
  screens.
- **Light, earthy surfaces.** White, cream, oat, soft beige, light wood, linen or pale
  marble. These match the app's palette (sage green, cream, oat, terracotta, butter
  yellow).
- **Food in the center.** One clear hero dish, filling about half to two thirds of the
  frame, with a little breathing room. The app crops photos to a wide band on cards and
  a near-square hero on detail pages, so keep the dish away from the edges.
- **Little clutter.** One or two props at most (a spoon, a napkin, a raw ingredient). No
  text, logos, brand packaging or watermarks.
- **Honest to the recipe.** The photo shows the dish as the recipe makes it: the same
  main ingredients, the same form (a no-bake ball is not a baked cookie; a mash is not a
  plated adult meal).

## Safety rules for baby photos

These matter more than looks, because parents copy what they see.

- **Only baby-safe food on baby recipes.** No whole grapes, whole blueberries or cherry
  tomatoes, whole nuts, popcorn, raw hard carrot or apple sticks, or chunks of meat.
- **No honey, syrup, sugar or added salt** visible in baby or toddler recipe photos.
- **No cow's milk as a drink** with babies under 12 months.
- **Babies are upright and supervised.** In a high chair or held upright, never lying
  down or propped with a bottle. No babies alone on counters, sinks or tables.
- **Safe sleep in any sleep photo.** On the back, on a firm, flat surface, no pillows,
  blankets or soft toys.
- **Real people look calm, not clinical.** Avoid photos that could be read as a symptom
  (rashes, coated tongues) unless the article is about that symptom and an expert has
  reviewed it.

## Sizes and files

- JPEG, quality about 82, around 1000 px on the long side.
- Recipes: landscape 3:2 or square. Articles and tips: square or 4:5 portrait.
- One file per photo in `assets/images/recipes/` or `assets/images/insights/`, named after
  the recipe or article id.
- Every new photo gets a credit row in `docs/photo-credits.md` and an entry in
  `src/content/photo-credits.json` (the tests check they match).

## Photo audit (October 14, 2026)

All 201 recipe and article photos, checked against this guide. Ordered by priority.

### 1. Safety (replace first)

| Photo                      | Issue                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| baby-carrot-zucchini-fries | Fixed October 15: now soft roasted carrot spears with a yogurt dip. (Was raw carrot and cucumber sticks.) |
| baby-oatmeal-blueberry     | Whole blueberries and strawberries next to a pink, smoothie-like bowl; the recipe mashes the berries.     |

### 2. Doesn't match the recipe or article

| Photo                                    | Shows                                                    | Recipe or article                                         |
| ---------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| newborn-overnight-oats                   | Fixed October 15 (was: yogurt jar topped with pineapple) | Peanut butter banana overnight oats                       |
| sweet-potato-spinach-hash                | Fixed October 15 (was: eggs in tomato sauce (shakshuka)) | Sweet potato and spinach hash                             |
| nursing-chocolate-chip-bites             | Fixed October 15 (was: baked cookies)                    | No-bake oat bites (balls)                                 |
| baby-salmon-potato-mash                  | Grown-up plate with peppers                              | Flaked salmon and cream cheese mash                       |
| baby-pear-chia-mash                      | Hand cutting a whole pear                                | Pear and chia mash                                        |
| toddler-yogurt-berry-bark                | Fixed October 15 (was: bowl of yogurt and berries)       | Frozen yogurt bark pieces                                 |
| food-prep-textures                       | Banana rounds                                            | Article recommends finger-length strips for 6 to 8 months |
| One pot for family and baby (13 recipes) | Photos borrowed from similar recipes                     | Each needs its own photo                                  |
| cluster-feeding                          | Fixed October 15 (was: borrowed from another article)    | Needs its own photo                                       |

### 3. Too dark for the app's bright look (brightness under 90)

Fixed October 15 with bright photos: smoothie-citrus-sunshine, nursing-oatmeal-chocolate-chip-cookies,
smoothie-cucumber-ginger, smoothie-greek-yogurt-berry, smoothie-tropical-green.

Still to do, darkest first: nursing-barley-milk-soup, nursing-flax-blueberry-yogurt-bowl, baby-broccoli-potato-mash,
baby-squash-chicken-risotto, toddler-broccoli-potato-tots, pb-banana-baked-oatmeal-cups,
solids-choking (article), honey-mustard-chicken-green-beans, black-bean-sweet-potato-chili,
smoothie-matcha-green, nursing-brown-sugar-oats, apple-cinnamon-porridge,
greek-chicken-salad-jars, smoothie-avocado-green, baby-two-textures-chili, egg-muffin-cups,
smoothie-papaya-mint.

These are fine to keep for now; swap them when a brighter photo turns up. The smoothies
are the biggest group, so a matching set of bright smoothie photos would lift the whole
Smoothies collection.

### 4. Looks good

Everything else, including all 44 single-food photos on the Foods tab (white background,
one food, centered) and most baby purees and articles.
