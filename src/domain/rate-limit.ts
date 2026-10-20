/** At most `max` requests in any `windowMs` stretch of time. */
export type RateRule = { max: number; windowMs: number };

export type RateDecision = { ok: true } | { ok: false; retryAfterSeconds: number };

export type RateLimiter = {
  /** Records a request for `key` if every rule allows it; otherwise says when to retry. */
  check(key: string, now?: number): RateDecision;
};

/**
 * A small in-memory sliding-window limiter. It keeps only request times per key (no
 * content), forgets keys once their longest window has passed, and holds at most
 * `maxKeys` keys, dropping the least recently seen first.
 */
export function createRateLimiter(rules: RateRule[], maxKeys = 10_000): RateLimiter {
  const longest = Math.max(...rules.map((r) => r.windowMs));
  // A Map keeps insertion order, so re-inserting a key on each request makes the
  // first entry the least recently seen.
  const hits = new Map<string, number[]>();

  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < longest);
      let wait = 0;
      for (const rule of rules) {
        const inWindow = recent.filter((t) => now - t < rule.windowMs);
        if (inWindow.length >= rule.max) {
          // The oldest request in the window has to age out before another fits.
          const oldest = inWindow[inWindow.length - rule.max];
          wait = Math.max(wait, oldest + rule.windowMs - now);
        }
      }
      hits.delete(key);
      if (wait > 0) {
        if (recent.length) hits.set(key, recent);
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(wait / 1000)) };
      }
      recent.push(now);
      hits.set(key, recent);
      while (hits.size > maxKeys) {
        const first = hits.keys().next().value;
        if (first === undefined) break;
        hits.delete(first);
      }
      return { ok: true };
    },
  };
}

/** Chat limits per connection: plenty for a real conversation, too few to run up a bill. */
export const CHAT_RATE_RULES: RateRule[] = [
  { max: 20, windowMs: 10 * 60 * 1000 },
  { max: 100, windowMs: 24 * 60 * 60 * 1000 },
];

/**
 * Who a request comes from, for rate limiting only: the connecting IP address the host
 * reports. It's held in memory to count requests, never logged or stored.
 */
export function clientKey(headers: Pick<Headers, 'get'>): string {
  const direct = headers.get('cf-connecting-ip') ?? headers.get('x-real-ip');
  if (direct) return direct.trim();
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || 'unknown';
}
