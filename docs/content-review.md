# Reviewing health content

All health-adjacent text lives in `src/content/` and ships marked as a draft.

## Monthly guides

- Text: `src/content/monthly-guides.json` (one entry per month, then 12–18 m, 18–24 m, 2 y+).
- Readable copy for reviewers: `docs/monthly-guides-review.md`
  (regenerate with `npm run content:guides-doc` after editing).
- US-based: drafted on 2026-10-08 by summarizing, in original wording, official US guidance
  from the CDC, AAP (HealthyChildren.org), FDA and HHS Office on Women's Health, with WHO
  for global context. Each section lists its sources.
- Where official US sources differ (for example, how long to wait between new foods), the
  section has a `note` explaining both.

## How to approve a guide

1. A qualified reviewer (named in each section's `reviewer` field) checks every section
   against its sources and your target region, and edits the text as needed.
2. Set the guide's `reviewStatus` to `"reviewed"`.
3. Run `npm run check`.

## Rules

- Never claim a food increases milk supply (a test enforces this).
- Every guide ends with "When to call your doctor", pointing to professional and
  emergency help.
