import type { SQLiteDatabase } from 'expo-sqlite';

import { calendarEntrySchema, type CalendarEntry } from '@/domain/calendar';

import type { CalendarStore } from './calendar-store';

type Row = { id: string; date: string; kind: string; text: string; time: string | null };

export function createSqliteCalendarStore(db: SQLiteDatabase): CalendarStore {
  return {
    async list() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, date, kind, text, time FROM calendar_entry ORDER BY date, time',
      );
      return rows.flatMap((r) => {
        const parsed = calendarEntrySchema.safeParse(r);
        return parsed.success ? [parsed.data] : [];
      });
    },
    async save(entry: CalendarEntry) {
      await db.runAsync(
        `INSERT INTO calendar_entry (id, date, kind, text, time, created_at) VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET date = excluded.date, kind = excluded.kind, text = excluded.text, time = excluded.time`,
        entry.id,
        entry.date,
        entry.kind,
        entry.text,
        entry.time,
        new Date().toISOString(),
      );
    },
    async remove(id) {
      await db.runAsync('DELETE FROM calendar_entry WHERE id = ?', id);
    },
  };
}
