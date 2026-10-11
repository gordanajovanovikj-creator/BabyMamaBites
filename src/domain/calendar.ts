import { z } from 'zod';

import { addDays, isIsoDate, type IsoDate } from './dates';

/** Kinds of things a mom can add to a calendar day. Stored values: append, never rename. */
export const calendarKinds = ['event', 'note'] as const;
export type CalendarKind = (typeof calendarKinds)[number];

export const calendarKindLabels: Record<CalendarKind, string> = {
  event: 'Event',
  note: 'Note',
};

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);

export const calendarEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().refine(isIsoDate),
  kind: z.enum(calendarKinds),
  text: z.string().trim().min(1).max(500),
  /** "HH:MM" for events with a time; null for all-day events and notes. */
  time: time.nullable(),
});
export type CalendarEntry = z.infer<typeof calendarEntrySchema>;

export type NewCalendarEntry = Omit<CalendarEntry, 'id'>;

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Validates and tidies a new entry; throws if it is not valid. */
export function makeCalendarEntry(input: NewCalendarEntry, id = newId()): CalendarEntry {
  return calendarEntrySchema.parse({
    id,
    ...input,
    text: input.text.trim(),
    time: input.kind === 'event' ? input.time : null,
  });
}

/** Entries on one day: timed events first (by time), then all-day events, then notes. */
export function entriesOn(entries: CalendarEntry[], date: IsoDate): CalendarEntry[] {
  const rank = (e: CalendarEntry) => (e.kind === 'event' ? (e.time ? 0 : 1) : 2);
  return entries
    .filter((e) => e.date === date)
    .sort((a, b) => rank(a) - rank(b) || (a.time ?? '').localeCompare(b.time ?? ''));
}

/** First day of the month containing `date`. */
export function monthStart(date: IsoDate): IsoDate {
  return `${date.slice(0, 7)}-01`;
}

/**
 * The month view as weeks of seven dates, Sunday first (US calendars), padded with
 * days from the neighboring months so every week is complete.
 */
export function monthGrid(date: IsoDate): IsoDate[][] {
  const first = monthStart(date);
  const [y, m] = first.split('-').map(Number);
  const weekday = new Date(y, m - 1, 1).getDay(); // 0 = Sunday
  let cursor = addDays(first, -weekday);
  const weeks: IsoDate[][] = [];
  do {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(cursor, i)));
    cursor = addDays(cursor, 7);
  } while (cursor.slice(0, 7) === first.slice(0, 7));
  return weeks;
}

/** "7:30 PM" from "19:30". */
export function formatTime(value: string): string {
  const [h, m] = value.split(':').map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
