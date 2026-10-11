import type { CalendarEntry } from '@/domain/calendar';

/** Mom's calendar events and notes. SQLite on devices; localStorage in the web preview. */
export type CalendarStore = {
  list(): Promise<CalendarEntry[]>;
  save(entry: CalendarEntry): Promise<void>;
  remove(id: string): Promise<void>;
};
