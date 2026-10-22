import { addDays, addMonths, fromIsoDate, type IsoDate } from './dates';
import { allergenProgress, foodsTriedCount, sortEntries, type FoodLogEntry } from './food-log';
import { allergens, type Allergen } from './profile';
import { allergenLabels } from './profile-labels';
import { babyAge, formatAge, type BabyDates } from './stage';

/** How much of the food log to put in the report. */
export const reportPeriods = ['last-30-days', 'last-3-months', 'all'] as const;
export type ReportPeriod = (typeof reportPeriods)[number];

export const reportPeriodLabels: Record<ReportPeriod, string> = {
  'last-30-days': 'Last 30 days',
  'last-3-months': 'Last 3 months',
  all: 'Everything',
};

export function entriesInPeriod(
  entries: FoodLogEntry[],
  period: ReportPeriod,
  onDate: IsoDate,
): FoodLogEntry[] {
  if (period === 'all') return entries;
  const from = period === 'last-30-days' ? addDays(onDate, -29) : addMonths(onDate, -3);
  return entries.filter((e) => e.date >= from && e.date <= onDate);
}

export type AllergenRow = {
  allergen: Allergen;
  label: string;
  status: 'Not tried yet' | 'Tried, no reaction logged' | 'Reaction logged';
  /** First day it was logged, or null if never. */
  firstTried: IsoDate | null;
};

export type PediatricianReport = {
  babyName: string | null;
  birthDate: IsoDate;
  dueDate: IsoDate | null;
  /** e.g. "7 months (corrected)". */
  age: string;
  period: ReportPeriod;
  generatedOn: IsoDate;
  foodsTried: number;
  newFoods: number;
  allergens: AllergenRow[];
  /** Entries with a mild or concerning reaction, newest first. */
  reactions: FoodLogEntry[];
  /** Every entry in the period, newest first. */
  entries: FoodLogEntry[];
};

const statusText = {
  'not-tried': 'Not tried yet',
  tried: 'Tried, no reaction logged',
  reaction: 'Reaction logged',
} as const;

/**
 * A summary of the food log for a pediatrician visit: allergens tried, any reactions, and
 * every food in the chosen period. Allergen status looks at the whole log, so an allergen
 * tried before the period still shows as tried.
 */
export function buildReport(
  baby: BabyDates & { babyName?: string | null },
  allEntries: FoodLogEntry[],
  period: ReportPeriod,
  onDate: IsoDate,
): PediatricianReport {
  const entries = sortEntries(entriesInPeriod(allEntries, period, onDate));
  const status = allergenProgress(allEntries);
  const age = babyAge(baby, onDate);
  return {
    babyName: baby.babyName?.trim() || null,
    birthDate: baby.birthDate,
    dueDate: baby.dueDate ?? null,
    age: `${formatAge(age)}${age.corrected ? ' (corrected)' : ''}`,
    period,
    generatedOn: onDate,
    foodsTried: foodsTriedCount(entries),
    newFoods: entries.filter((e) => e.isNew).length,
    allergens: allergens.map((a) => ({
      allergen: a,
      label: allergenLabels[a],
      status: statusText[status[a]],
      firstTried:
        allEntries
          .filter((e) => e.allergen === a)
          .map((e) => e.date)
          .sort()[0] ?? null,
    })),
    reactions: entries.filter((e) => e.reaction !== 'none'),
    entries,
  };
}

const reactionText: Record<FoodLogEntry['reaction'], string> = {
  none: 'None',
  mild: 'Mild',
  concerning: 'Concerning',
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function formatReportDate(date: IsoDate): string {
  return fromIsoDate(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** File name for the shared PDF, e.g. "Food log Mila 2026-10-22". */
export function reportFileName(report: PediatricianReport): string {
  const name = report.babyName?.replace(/[^\p{L}\p{N} '-]/gu, '').trim();
  return ['Food log', name, report.generatedOn].filter(Boolean).join(' ');
}

/** The report as a self-contained, printable US Letter page (no images or outside files). */
export function reportHtml(report: PediatricianReport): string {
  const d = formatReportDate;
  const who = report.babyName ? esc(report.babyName) : 'Your baby';
  const facts = [
    ['Born', d(report.birthDate)],
    ...(report.dueDate ? [['Due date', d(report.dueDate)]] : []),
    ['Age today', esc(report.age)],
    ['Period', reportPeriodLabels[report.period]],
    ['Foods logged', String(report.foodsTried)],
    ['First tastes', String(report.newFoods)],
  ]
    .map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`)
    .join('');

  const allergenRows = report.allergens
    .map(
      (a) =>
        `<tr class="${a.status === 'Reaction logged' ? 'flag' : ''}"><td>${a.label}</td><td>${
          a.status
        }</td><td>${a.firstTried ? d(a.firstTried) : '-'}</td></tr>`,
    )
    .join('');

  const reactionList = report.reactions.length
    ? `<ul>${report.reactions
        .map(
          (e) =>
            `<li><strong>${d(e.date)}: ${esc(e.food)}</strong> (${reactionText[
              e.reaction
            ].toLowerCase()})${e.notes ? `. ${esc(e.notes)}` : ''}</li>`,
        )
        .join('')}</ul>`
    : '<p>No reactions logged in this period.</p>';

  const logRows = report.entries.length
    ? report.entries
        .map(
          (e) =>
            `<tr class="${e.reaction !== 'none' ? 'flag' : ''}"><td>${d(e.date)}</td><td>${esc(
              e.food,
            )}</td><td>${e.allergen ? allergenLabels[e.allergen] : ''}</td><td>${
              e.isNew ? 'Yes' : ''
            }</td><td>${reactionText[e.reaction]}</td><td>${e.notes ? esc(e.notes) : ''}</td></tr>`,
        )
        .join('')
    : '<tr><td colspan="6">Nothing logged in this period.</td></tr>';

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" />
<style>
  @page { margin: 40px; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #2c2a25; font-size: 12px; line-height: 1.45; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  h2 { font-size: 15px; margin: 22px 0 8px; color: #2e4a31; }
  .sub { color: #6a655b; margin: 0 0 14px; }
  .facts { display: flex; flex-wrap: wrap; gap: 8px; }
  .facts div { border: 1px solid #e9e3d8; border-radius: 10px; padding: 8px 12px; min-width: 110px; }
  .facts span { display: block; color: #6a655b; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; }
  .facts strong { font-size: 14px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e9e3d8; vertical-align: top; }
  th { color: #6a655b; font-size: 10px; text-transform: uppercase; letter-spacing: .05em; }
  tr { page-break-inside: avoid; }
  td:first-child { white-space: nowrap; }
  tr.flag td { color: #8a2d16; font-weight: 600; }
  ul { margin: 0; padding-left: 18px; }
  .note { margin-top: 24px; color: #6a655b; font-size: 10px; }
</style></head>
<body>
  <h1>Food log: ${who}</h1>
  <p class="sub">Shared from the Mama &amp; Baby Bites app on ${d(report.generatedOn)}</p>
  <div class="facts">${facts}</div>
  <h2>Reactions</h2>
  ${reactionList}
  <h2>Common allergens</h2>
  <table><thead><tr><th>Allergen</th><th>Status</th><th>First logged</th></tr></thead><tbody>${allergenRows}</tbody></table>
  <h2>Every food logged (${reportPeriodLabels[report.period].toLowerCase()})</h2>
  <table><thead><tr><th>Date</th><th>Food</th><th>Allergen</th><th>First time</th><th>Reaction</th><th>Notes</th></tr></thead><tbody>${logRows}</tbody></table>
  <p class="note">Logged by the family in the Mama &amp; Baby Bites app. This is a parent's record to help the conversation with your pediatrician, not a medical record. Reactions are as the family described them.</p>
</body></html>`;
}
