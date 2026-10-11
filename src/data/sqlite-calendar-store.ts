import type { SQLiteDatabase } from 'expo-sqlite';

import { calendarEntrySchema, type CalendarEntry } from '@/domain/calendar';

import type { CalendarStore } from './calendar-store';

type Row = {
  id: string;
  date: string;
  kind: string;
  text: string;
  time: string | null;
  remind: number;
};

export function createSqliteCalendarStore(db: SQLiteDatabase): CalendarStore {
  return {
    async list() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, date, kind, text, time, remind FROM calendar_entry ORDER BY date, time',
      );
      return rows.flatMap((r) => {
        const parsed = calendarEntrySchema.safeParse({ ...r, remind: r.remind === 1 });
        return parsed.success ? [parsed.data] : [];
      });
    },
    async save(entry: CalendarEntry) {
      await db.runAsync(
        `INSERT INTO calendar_entry (id, date, kind, text, time, remind, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET date = excluded.date, kind = excluded.kind, text = excluded.text, time = excluded.time, remind = excluded.remind`,
        entry.id,
        entry.date,
        entry.kind,
        entry.text,
        entry.time,
        entry.remind ? 1 : 0,
        new Date().toISOString(),
      );
    },
    async remove(id) {
      await db.runAsync('DELETE FROM calendar_entry WHERE id = ?', id);
    },
  };
}
