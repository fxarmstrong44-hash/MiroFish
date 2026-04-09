// Scalability Researcher — Monitor and suggest performance optimizations

export interface PerformanceMetrics {
  avgResponseTimeMs: number;
  p95ResponseTimeMs: number;
  requestsPerMinute: number;
  errorRate: number;
  cacheHitRate: number;
  activeConnections: number;
}

const responseTimesMs: number[] = [];
let requestCount = 0;
let errorCount = 0;
let cacheHits = 0;
let cacheMisses = 0;

export function recordRequest(responseTimeMs: number, isError = false) {
  responseTimesMs.push(responseTimeMs);
  requestCount++;
  if (isError) errorCount++;
  if (responseTimesMs.length > 1000) responseTimesMs.shift();
}

export function recordCacheResult(hit: boolean) {
  if (hit) cacheHits++;
  else cacheMisses++;
}

export function getMetrics(): PerformanceMetrics {
  const sorted = [...responseTimesMs].sort((a, b) => a - b);
  const totalCacheChecks = cacheHits + cacheMisses;

  return {
    avgResponseTimeMs: sorted.length > 0 ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0,
    p95ResponseTimeMs: sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.95)] : 0,
    requestsPerMinute: requestCount,
    errorRate: requestCount > 0 ? (errorCount / requestCount) * 100 : 0,
    cacheHitRate: totalCacheChecks > 0 ? (cacheHits / totalCacheChecks) * 100 : 0,
    activeConnections: 0,
  };
}

export function suggestScalingActions(): string[] {
  const metrics = getMetrics();
  const suggestions: string[] = [];

  if (metrics.avgResponseTimeMs > 2000) {
    suggestions.push("Average response time >2s. Consider adding Redis caching layer for market data.");
  }
  if (metrics.p95ResponseTimeMs > 5000) {
    suggestions.push("P95 latency >5s. Investigate slow AI model calls — consider streaming responses.");
  }
  if (metrics.errorRate > 5) {
    suggestions.push("Error rate >5%. Review API provider health and implement circuit breaker pattern.");
  }
  if (metrics.cacheHitRate < 30) {
    suggestions.push("Cache hit rate <30%. Increase cache TTL for market data and AI responses.");
  }

  return suggestions;
}
