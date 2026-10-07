/**
 * Calendar-date helpers. Dates are plain ISO strings ("2026-03-14") with no
 * time or time zone, so a birthday never shifts when the clocks change.
 */
export type IsoDate = string;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type Parts = { year: number; month: number; day: number };

export function isIsoDate(value: string): value is IsoDate {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month);
}

function parts(date: IsoDate): Parts {
  if (!isIsoDate(date)) throw new Error(`Invalid ISO date: ${date}`);
  const [year, month, day] = date.split('-').map(Number);
  return { year, month, day };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function toUtc({ year, month, day }: Parts): number {
  return Date.UTC(year, month - 1, day);
}

function fromParts({ year, month, day }: Parts): IsoDate {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** The device's local calendar date for a JS Date. */
export function toIsoDate(date: Date): IsoDate {
  return fromParts({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
}

/** A JS Date at local midnight, for date pickers. */
export function fromIsoDate(date: IsoDate): Date {
  const { year, month, day } = parts(date);
  return new Date(year, month - 1, day);
}

export function today(): IsoDate {
  return toIsoDate(new Date());
}

/** Whole days from `from` to `to` (negative if `to` is earlier). */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtc(parts(to)) - toUtc(parts(from))) / MS_PER_DAY);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  const d = new Date(toUtc(parts(date)) + days * MS_PER_DAY);
  return fromParts({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() });
}

/** Adds calendar months, clamping to the end of shorter months (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(date: IsoDate, months: number): IsoDate {
  const { year, month, day } = parts(date);
  const total = year * 12 + (month - 1) + months;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return fromParts({ year: y, month: m, day: Math.min(day, daysInMonth(y, m)) });
}

/** Completed calendar months from `from` to `to` (like counting monthly birthdays). */
export function monthsBetween(from: IsoDate, to: IsoDate): number {
  if (daysBetween(from, to) < 0) return -monthsBetween(to, from);
  const a = parts(from);
  const b = parts(to);
  let months = (b.year - a.year) * 12 + (b.month - a.month);
  if (daysBetween(addMonths(from, months), to) < 0) months -= 1;
  return months;
}
