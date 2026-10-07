import { addDays, addMonths, daysBetween, isIsoDate, monthsBetween } from './dates';

describe('isIsoDate', () => {
  it.each(['2026-01-31', '2024-02-29'])('accepts %s', (d) => expect(isIsoDate(d)).toBe(true));
  it.each(['2025-02-29', '2026-13-01', '2026-1-5', 'yesterday', ''])('rejects %s', (d) =>
    expect(isIsoDate(d)).toBe(false),
  );
});

describe('daysBetween', () => {
  it('counts whole days, ignoring daylight-saving changes', () => {
    expect(daysBetween('2026-03-28', '2026-03-30')).toBe(2); // EU clocks change 29 Mar
    expect(daysBetween('2026-11-01', '2026-11-02')).toBe(1); // US clocks change 1 Nov
  });
  it('is negative when the second date is earlier', () => {
    expect(daysBetween('2026-01-10', '2026-01-01')).toBe(-9);
  });
});

describe('addDays / addMonths', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2025-12-30', 3)).toBe('2026-01-02');
  });
  it('clamps to the end of shorter months', () => {
    expect(addMonths('2026-01-31', 1)).toBe('2026-02-28');
    expect(addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(addMonths('2025-08-31', 6)).toBe('2026-02-28');
  });
});

describe('monthsBetween', () => {
  it('counts completed calendar months', () => {
    expect(monthsBetween('2026-01-15', '2026-02-14')).toBe(0);
    expect(monthsBetween('2026-01-15', '2026-02-15')).toBe(1);
    expect(monthsBetween('2025-04-10', '2026-04-10')).toBe(12);
  });
  it('treats the last day of a short month as a monthly birthday', () => {
    expect(monthsBetween('2026-01-31', '2026-02-28')).toBe(1);
  });
});
