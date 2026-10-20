import { clientKey, createRateLimiter } from './rate-limit';

const MIN = 60 * 1000;

describe('createRateLimiter', () => {
  it('allows up to the limit, then says when to try again', () => {
    const limiter = createRateLimiter([{ max: 3, windowMs: MIN }]);
    expect(limiter.check('a', 0)).toEqual({ ok: true });
    expect(limiter.check('a', 1000)).toEqual({ ok: true });
    expect(limiter.check('a', 2000)).toEqual({ ok: true });
    expect(limiter.check('a', 3000)).toEqual({ ok: false, retryAfterSeconds: 57 });
    // The first request has aged out of the window.
    expect(limiter.check('a', MIN)).toEqual({ ok: true });
  });

  it('does not count refused requests', () => {
    const limiter = createRateLimiter([{ max: 1, windowMs: MIN }]);
    limiter.check('a', 0);
    limiter.check('a', 10_000);
    limiter.check('a', 20_000);
    expect(limiter.check('a', MIN)).toEqual({ ok: true });
  });

  it('keeps each key separate', () => {
    const limiter = createRateLimiter([{ max: 1, windowMs: MIN }]);
    expect(limiter.check('a', 0).ok).toBe(true);
    expect(limiter.check('b', 0).ok).toBe(true);
    expect(limiter.check('a', 1).ok).toBe(false);
  });

  it('applies every rule and waits for the slowest', () => {
    const limiter = createRateLimiter([
      { max: 2, windowMs: MIN },
      { max: 3, windowMs: 10 * MIN },
    ]);
    limiter.check('a', 0);
    limiter.check('a', 1000);
    expect(limiter.check('a', 2 * MIN).ok).toBe(true);
    // 3 in 10 minutes: wait until the first one is 10 minutes old.
    expect(limiter.check('a', 3 * MIN)).toEqual({ ok: false, retryAfterSeconds: 7 * 60 });
  });

  it('holds a limited number of keys, dropping the least recently seen', () => {
    const limiter = createRateLimiter([{ max: 1, windowMs: MIN }], 2);
    limiter.check('a', 0);
    limiter.check('b', 1);
    limiter.check('c', 2);
    // "a" was forgotten, so it is allowed again; "c" is still counted.
    expect(limiter.check('a', 3).ok).toBe(true);
    expect(limiter.check('c', 4).ok).toBe(false);
  });
});

describe('clientKey', () => {
  const headers = (h: Record<string, string>) => new Headers(h);

  it('prefers the address the host reports', () => {
    expect(
      clientKey(headers({ 'cf-connecting-ip': '1.2.3.4', 'x-forwarded-for': '9.9.9.9' })),
    ).toBe('1.2.3.4');
    expect(clientKey(headers({ 'x-forwarded-for': '5.6.7.8, 10.0.0.1' }))).toBe('5.6.7.8');
    expect(clientKey(headers({}))).toBe('unknown');
  });
});
