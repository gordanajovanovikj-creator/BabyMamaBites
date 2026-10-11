import {
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
    expect(e).toEqual({ id: 'x', date: '2026-10-11', kind: 'note', text: 'hi', time: null });
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
    ({ id, date, kind, text: id, time }) as CalendarEntry;
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
