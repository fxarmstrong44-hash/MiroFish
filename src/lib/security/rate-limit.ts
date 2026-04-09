const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export function authRateLimit(ip: string) {
  return rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
}

export function apiRateLimit(ip: string) {
  return rateLimit(`api:${ip}`, 60, 60 * 1000);
}
