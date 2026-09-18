export class RateLimiter {
  private cache = new Map<string, { count: number; expiresAt: number }>();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs = 60000, maxRequests = 10) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(id: string): boolean {
    const now = Date.now();
    const record = this.cache.get(id);

    if (!record || record.expiresAt < now) {
      this.cache.set(id, { count: 1, expiresAt: now + this.windowMs });
      return true;
    }

    if (record.count >= this.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }
}

export const globalRateLimiter = new RateLimiter(60000, 15); // 15 requests per minute per user
