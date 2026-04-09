import type { HistoricalBar } from "../data-layer";

export function breakoutStrategy(bars: HistoricalBar[]) {
  if (bars.length < 20) {
    return { strategy: "Breakout", signal: "hold" as const, strength: 0, reasoning: "Insufficient data." };
  }

  const recent = bars.slice(-20);
  const high20 = Math.max(...recent.map((b) => b.high));
  const low20 = Math.min(...recent.map((b) => b.low));
  const range = high20 - low20;

  const current = bars[bars.length - 1];
  const avgVolume = recent.reduce((s, b) => s + b.volume, 0) / recent.length;
  const volumeRatio = avgVolume > 0 ? current.volume / avgVolume : 1;

  let score = 50;

  // Breakout above resistance
  if (current.close > high20 * 0.98) {
    score += 20;
    if (volumeRatio > 1.5) score += 15; // Volume confirmation
  }

  // Breakdown below support
  if (current.close < low20 * 1.02) {
    score -= 20;
    if (volumeRatio > 1.5) score -= 15;
  }

  // Range compression (Bollinger squeeze) — potential breakout setup
  const rangeRatio = range / current.close;
  if (rangeRatio < 0.05) score += 5; // Tight range = potential energy

  const signal = score >= 65 ? "buy" as const : score <= 35 ? "sell" as const : "hold" as const;

  return {
    strategy: "Breakout",
    signal,
    strength: Math.min(100, Math.max(0, score)),
    reasoning: `20d range: ${low20.toFixed(2)}-${high20.toFixed(2)}, Volume ratio: ${volumeRatio.toFixed(1)}x, ${current.close > high20 * 0.98 ? "Near/above resistance" : current.close < low20 * 1.02 ? "Near/below support" : "Within range"}.`,
  };
}
