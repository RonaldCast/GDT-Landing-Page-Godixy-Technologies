export interface RateLimiter {
  /** Records an attempt and returns false when the key exceeded its quota. */
  hit(key: string, now?: number): boolean;
}

/**
 * In-memory sliding-window limiter. Sufficient for a single Node instance;
 * swap for a shared store (Redis) if the site is ever scaled horizontally.
 */
export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);

      if (hits.size > maxKeys) {
        for (const [k, times] of hits) {
          if (times.every((t) => now - t >= windowMs)) hits.delete(k);
        }
      }
      return true;
    },
  };
}
