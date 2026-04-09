const blockedIPs = new Map<string, { until: number; reason: string }>();
const failedAttempts = new Map<string, number>();

export function recordFailedAuth(ip: string): void {
  const attempts = (failedAttempts.get(ip) || 0) + 1;
  failedAttempts.set(ip, attempts);

  // Auto-block after 10 failed attempts for 1 hour
  if (attempts >= 10) {
    blockedIPs.set(ip, {
      until: Date.now() + 60 * 60 * 1000,
      reason: "Excessive failed authentication attempts",
    });
    failedAttempts.delete(ip);
  }
}

export function isBlocked(ip: string): { blocked: boolean; reason?: string } {
  const entry = blockedIPs.get(ip);
  if (!entry) return { blocked: false };
  if (Date.now() > entry.until) {
    blockedIPs.delete(ip);
    return { blocked: false };
  }
  return { blocked: true, reason: entry.reason };
}

export function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

export function detectAnomalousActivity(userId: string, action: string): boolean {
  // Flag rapid-fire API calls that bypass normal rate limits
  const key = `${userId}:${action}`;
  const attempts = (failedAttempts.get(key) || 0) + 1;
  failedAttempts.set(key, attempts);

  if (attempts > 100) {
    failedAttempts.delete(key);
    return true; // Anomalous
  }
  return false;
}
