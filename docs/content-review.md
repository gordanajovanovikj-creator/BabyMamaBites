# Reviewing health content

All health-adjacent text lives in `src/content/` and ships marked as a draft.

## Monthly guides

- Text: `src/content/monthly-guides.json` (one entry per month, then 12–18 m, 18–24 m, 2 y+).
- Readable copy for reviewers: `docs/monthly-guides-review.md`
  (regenerate with `npm run content:guides-doc` after editing).
- Drafted on 2026-10-08 by summarising, in original wording, official guidance from the
  CDC, NHS, AAP (HealthyChildren.org) and WHO. Each section lists its sources.
- Where US and UK guidance differ, the section has a `note` explaining both.

## How to approve a guide

1. A qualified reviewer (named in each section's `reviewer` field) checks every section
   against its sources and your target region, and edits the text as needed.
2. Remove `[PLACEHOLDER - needs expert review]` from the start of the intro and every
   section's first paragraph.
3. Set the guide's `reviewStatus` to `"reviewed"`.
4. Run `npm run check`. Tests fail if a guide is marked reviewed but still has markers,
   or if markers are missing on a draft.

## Rules

- Never claim a food increases milk supply (a test enforces this).
- Every guide ends with "When to call your doctor", pointing to professional and
  emergency help.
