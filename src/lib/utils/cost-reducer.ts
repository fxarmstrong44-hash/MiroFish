// Cost Reducer — Track and optimize API usage costs

interface UsageEntry {
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  timestamp: number;
}

const usageLog: UsageEntry[] = [];
const cache = new Map<string, { result: string; expiry: number }>();

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "claude-sonnet-4-20250514": { input: 0.003, output: 0.015 },
  "llama-3.1-sonar-large-128k-online": { input: 0.001, output: 0.001 },
};

export function trackUsage(provider: string, model: string, inputTokens: number, outputTokens: number) {
  const rates = COST_PER_1K_TOKENS[model] || { input: 0.005, output: 0.015 };
  const cost = (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;

  usageLog.push({ provider, model, inputTokens, outputTokens, estimatedCost: cost, timestamp: Date.now() });
}

export function getCachedResponse(key: string): string | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.result;
}

export function setCachedResponse(key: string, result: string, ttlMs = 5 * 60 * 1000) {
  cache.set(key, { result, expiry: Date.now() + ttlMs });
}

export function getDailyCostSummary(): { total: number; byModel: Record<string, number> } {
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recent = usageLog.filter((e) => e.timestamp > dayAgo);
  const byModel: Record<string, number> = {};
  let total = 0;

  for (const entry of recent) {
    byModel[entry.model] = (byModel[entry.model] || 0) + entry.estimatedCost;
    total += entry.estimatedCost;
  }

  return { total: Math.round(total * 10000) / 10000, byModel };
}

export function suggestCostOptimizations(): string[] {
  const summary = getDailyCostSummary();
  const suggestions: string[] = [];

  if (summary.total > 10) {
    suggestions.push("Daily API costs exceed $10. Consider increasing cache TTL for frequently requested data.");
  }

  if (summary.byModel["gpt-4o"] > summary.total * 0.5) {
    suggestions.push("GPT-4o accounts for >50% of costs. Route simpler queries to Claude Haiku or Perplexity.");
  }

  return suggestions;
}
