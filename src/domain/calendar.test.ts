import {
  calendarReminders,
  entriesOn,
  formatTime,
  makeCalendarEntry,
  monthGrid,
  monthStart,
  type CalendarEntry,
} from './calendar';

describe('monthGrid', () => {
  it('starts on Sunday and covers the whole month in full weeks', () => {
    const weeks = monthGrid('2026-10-15'); // Oct 1, 2026 is a Thursday
    expect(weeks[0][0]).toBe('2026-09-27');
    expect(weeks[0][4]).toBe('2026-10-01');
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks.flat()).toContain('2026-10-31');
    expect(weeks[weeks.length - 1][6] >= '2026-10-31').toBe(true);
  });
  it('does not add a trailing week of next month only', () => {
    // Feb 2026 starts on a Sunday and has exactly four weeks.
    expect(monthGrid('2026-02-10')).toHaveLength(4);
  });
});

describe('monthStart', () => {
  it('returns the first of the month', () => {
    expect(monthStart('2026-10-15')).toBe('2026-10-01');
  });
});

describe('makeCalendarEntry', () => {
  it('trims text and drops the time on notes', () => {
    const e = makeCalendarEntry(
      { date: '2026-10-11', kind: 'note', text: '  hi ', time: '09:00' },
      'x',
    );
    expect(e).toEqual({
      id: 'x',
      date: '2026-10-11',
      kind: 'note',
      text: 'hi',
      time: null,
      remind: false,
    });
  });
  it('rejects empty text and bad times', () => {
    expect(() =>
      makeCalendarEntry({ date: '2026-10-11', kind: 'event', text: ' ', time: null }),
    ).toThrow();
    expect(() =>
      makeCalendarEntry({ date: '2026-10-11', kind: 'event', text: 'Visit', time: '25:00' }),
    ).toThrow();
  });
});

describe('entriesOn', () => {
  const e = (id: string, kind: CalendarEntry['kind'], time: string | null, date = '2026-10-11') =>
    ({ id, date, kind, text: id, time, remind: false }) as CalendarEntry;
  it('orders timed events, then all-day events, then notes', () => {
    const list = [
      e('note', 'note', null),
      e('allday', 'event', null),
      e('late', 'event', '15:00'),
      e('early', 'event', '09:00'),
      e('other', 'event', null, '2026-10-12'),
    ];
    expect(entriesOn(list, '2026-10-11').map((x) => x.id)).toEqual([
      'early',
      'late',
      'allday',
      'note',
    ]);
  });
});

describe('formatTime', () => {
  it('uses a 12-hour clock', () => {
    expect(formatTime('00:05')).toBe('12:05 AM');
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('19:30')).toBe('7:30 PM');
  });
});

describe('calendarReminders', () => {
  const ev = (id: string, date: string, time: string | null, remind = true) =>
    ({ id, date, kind: 'event', text: `Text ${id}`, time, remind }) as CalendarEntry;
  const now = new Date(2026, 9, 11, 10, 0); // Oct 11, 2026, 10:00 AM

  it('schedules upcoming events with remind on, soonest first', () => {
    const list = [
      ev('tomorrow', '2026-10-12', '08:00'),
      ev('later-today', '2026-10-11', '15:30'),
      ev('past-today', '2026-10-11', '09:00'),
      ev('yesterday', '2026-10-10', '12:00'),
      ev('off', '2026-10-12', '08:00', false),
      ev('allday', '2026-10-13', null),
    ];
    const out = calendarReminders(list, now);
    expect(out.map((r) => r.id)).toEqual([
      'calendar-later-today',
      'calendar-tomorrow',
      'calendar-allday',
    ]);
    expect(out[0]).toMatchObject({
      title: 'Today at 3:30 PM',
      body: 'Text later-today',
      trigger: { kind: 'date', date: '2026-10-11', hour: 15, minute: 30 },
    });
    expect(out[2].trigger).toMatchObject({ hour: 9, minute: 0 });
  });

  it('never schedules notes', () => {
    const note = {
      id: 'n',
      date: '2026-10-12',
      kind: 'note',
      text: 'x',
      time: null,
      remind: true,
    } as CalendarEntry;
    expect(calendarReminders([note], now)).toEqual([]);
  });
});
