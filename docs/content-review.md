# Health content

All health-adjacent text lives in `src/content/`, based on official US sources. The app
shows medical disclaimers on every health page; content has no review markers or status.

## Monthly guides

- Text: `src/content/monthly-guides.json` (one entry per month, then 12–18 m, 18–24 m, 2 y+).
- Readable copy: `docs/monthly-guides-review.md`
  (regenerate with `npm run content:guides-doc` after editing).
- US-based: drafted on 2026-10-08 by summarizing, in original wording, official US guidance
  from the CDC, AAP (HealthyChildren.org), FDA and HHS Office on Women's Health, with WHO
  for global context. Each section lists its sources.
- Where official US sources differ (for example, how long to wait between new foods), the
  section has a `note` explaining both.

## Editing a guide

1. Change the text in `src/content/monthly-guides.json`, keeping it in line with the
   section's official sources (add a source if you use a new one).
2. Run `npm run content:guides-doc` to refresh the readable copy.
3. Run `npm run check`.

## Rules

- Never claim a food increases milk supply (a test enforces this).
- Every guide ends with "When to call your doctor", pointing to professional and
  emergency help.
