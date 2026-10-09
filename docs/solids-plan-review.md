# Starting-solids plan: content check (v2)

This is a line-by-line check of `src/content/solids-plan.json` against the official US
sources it cites (CDC, AAP/HealthyChildren.org, FDA; pages read 2026-10-08). It is **not**
a professional sign-off. Every week stays `reviewStatus: "placeholder"` until a
pediatrician or registered dietitian reviews it.

## Changes in v2

| Area | Issue found | Source | Change |
| --- | --- | --- | --- |
| Pacing, weeks 1–12 | The plan suggested 3 new foods plus an allergen per week (about 4 new foods in 7 days). CDC and AAP say to introduce one single-ingredient food at a time, **3 to 5 days apart**. | cdc-solids, aap-solids | Weeks 1–2 have 2 new foods; allergen weeks have the allergen plus 1 other food. The UI now says "New foods this week · One at a time, 3 to 5 days apart" for weeks 1–12 and "Ideas this week" afterward. A test enforces the limit. |
| Weekly intros | Weeks in the same texture stage repeated the same intro (e.g. weeks 5–8 and 13–18). | n/a | Each of the 26 weeks now has its own title, intro, tips and sources (see below). A test makes sure no two are the same. |
| Week 1 | Pureed meat, cereal and sweet potato were all listed as first foods. | aap-allergens (start with a few low-allergy foods), cdc-solids | Week 1 is iron-fortified oat or barley cereal, then sweet potato. Meat moves to week 2 ("Iron-rich foods"). |
| Choking list | It said "crackers or bread with seeds **or whole grains**", but the CDC/WIC list says "seeds, nut pieces, or **whole grain kernels**". Some items were missing. | cdc-choking | Wording now matches the CDC list. Added whole pieces of canned fruit, cookies, and whole kernels of cooked grains. |
| Cheese | "Small pieces of mild cheese" | cdc-avoid, cdc-choking | Changed to "small, thin slices of **pasteurized** mild cheese", with a tip to cut it into strips, not chunks. |
| Honey | The honey reminder appeared only in later weeks, with no reason given. | cdc-avoid | Week 17 explains infant botulism; week 25 repeats "no honey until the first birthday". |

## Week-by-week focus (v2)

| Week | Title | What it adds | Sources |
| --- | --- | --- | --- |
| 1 | First tastes | How much to offer and when; offering milk first can help | cdc-solids, aap-solids |
| 2 | Iron-rich foods | Heme vs. plant iron; pairing with vitamin C | cdc-iron |
| 3 | Hungry or full? | Hunger and fullness cues; first allergen (egg) | cdc-hungry, aap-allergens |
| 4 | Peanut, the early way | Early peanut introduction; high-risk babies see the pediatrician first | aap-allergens |
| 5 | Thicker textures | Thicker purees; gagging is normal; dairy (yogurt, not cow's milk to drink) | cdc-textures, cdc-cowsmilk |
| 6 | A first cup | Water 4–8 oz a day in a cup; no juice | cdc-encourage, cdc-utensils, aap-solids |
| 7 | Try, try again | 8–10 tries; wait a week and offer again | cdc-picky |
| 8 | A rainbow of foods | All food groups by 7–8 months; vary cereals because of arsenic in rice | cdc-solids, cdc-encourage |
| 9 | Finger foods | Readiness for finger foods and examples; low-mercury fish | cdc-utensils, aap-solids, fda-fish |
| 10 | What's in the diaper | Normal changes in poop; when to slow down and call | aap-solids |
| 11 | Lumpier and messier | Lumpy textures; open cup from 9 months; about 4 oz per meal | cdc-textures, cdc-utensils, aap-solids |
| 12 | Keep allergens on the menu | Keep tolerated allergens in the diet; portion examples | aap-allergens |
| 13 | Finely chopped | Chopped and ground foods; grind whole-grain kernels | cdc-textures, cdc-solids |
| 14 | A daily rhythm | 3 meals and 2–3 snacks; avoid grazing | cdc-howmuch-food |
| 15 | Eating together | Family meals; calm meals with no distractions | aap-solids, cdc-picky, cdc-choking |
| 16 | Iron check-in | Iron-rich food most days; preterm babies; anemia check around 12 months | cdc-iron |
| 17 | No added salt or sugar | Added sugar; sodium; honey and botulism | cdc-avoid |
| 18 | Self-feeding | Spoon use from 10–12 months; finger feeding | cdc-utensils |
| 19 | Family foods, chopped | Pieces no larger than 1/2 inch | aap-choking, cdc-encourage |
| 20 | Choking-safe shapes | Cutting round and long foods; foods to avoid | cdc-choking, aap-choking |
| 21 | Fish for growing brains | FDA Best Choices; about 1 oz servings around age 1 | fda-fish |
| 22 | Let them lead | Appetite varies; food isn't a reward | cdc-hungry, cdc-howmuch-food |
| 23 | Safe food handling | Leftovers; pasteurized foods only | aap-solids, cdc-avoid |
| 24 | Picky phases | Refusing foods is normal; giving choices | cdc-picky |
| 25 | Getting ready for 12 months | Cow's milk at 12 months, not before; juice limits | cdc-cowsmilk, aap-solids |
| 26 | First birthday | Appetite slows; 12-month checkup and anemia test | cdc-howmuch-food, cdc-iron |

## Questions for the human reviewer

1. **Allergen order and timing.** Egg comes in week 3, then one allergen a week through
   week 11. AAP allows starting once a few first foods are tolerated. Is one allergen a week
   right, or should some be spaced further apart?
2. **"3 to 5 days" vs. "at least a day".** CDC and AAP's solids page say 3 to 5 days; AAP's
   allergen page says "at least a day". The plan follows the stricter 3 to 5 days. Should
   the advice relax after week 12?
3. **Portion examples.** About 1/3 egg, about 4 oz per meal and 1 oz fish around age 1
   are quoted from AAP and FDA. The nut butter portion is **about 1 teaspoon** by product
   decision; AAP's example is about 2 teaspoons. Please confirm.
4. **Week 20 foods** (quartered grapes, soft-cooked apple slices) at about 10–11 months:
   confirm the texture advice.
5. **Water amount.** CDC says 4–8 oz a day; AAP says "no more than 1 cup (8 oz)". The plan
   uses CDC's range.

## Egg allergy note (week 3)

Added a tip to week 3: most egg allergies are to egg-white proteins, but the yolk can cause
reactions too and the two can't be fully separated, so worried parents should ask their
pediatrician how to introduce egg. Source: ACAAI, "Egg Allergy" ("Allergy to egg white
proteins is most common"; "it is not possible to completely separate the white from the
yolk"). This replaces a suggested "yolk only" tip, which the source doesn't support.

## Insights articles (`src/content/solids-articles.json`)

12 draft articles on the Plan tab, each with an age range and sources. The Insights row and
the "See all" page show the articles for the baby's current age first, then upcoming ones.

| Article | Ages | Sources |
| --- | --- | --- |
| Is my baby ready for solids? | 4–7 months | cdc-solids, aap-solids |
| Choosing and using a high chair | 5 months+ | AAP "6 Quick High Chair Safety Tips", CPSC high chair standard (2019) |
| Purees or finger foods? | 5–10 months | cdc-textures, aap-solids, cdc-utensils |
| What to offer first | 5–9 months | cdc-solids, aap-solids, cdc-iron |
| Introducing common allergens | 5–12 months | aap-allergens, aap-anaphylaxis, acaai-egg |
| Gagging or choking? | 5 months+ | aap-choking, cdc-choking |
| Hungry or full? | 6 months+ | cdc-hungry |
| Cups, water and juice | 6–14 months | cdc-utensils, cdc-encourage, aap-solids |
| Making and storing baby food | 5–12 months | aap-solids, cdc-solids |
| Foods to skip in the first year | 5–12 months | cdc-avoid, cdc-cowsmilk |
| When your baby refuses food | 8 months+ | cdc-picky |
| Moving to cow's milk | 11–18 months | cdc-cowsmilk |

For the reviewer: the high-chair article suggests checking CPSC.gov for recalls on a
secondhand chair; that line is based on CPSC's recall rules, not on a tip from the page.
