import type { HistoricalBar } from "../data-layer";

export function meanReversionStrategy(bars: HistoricalBar[]) {
  if (bars.length < 20) {
    return { strategy: "Mean Reversion", signal: "hold" as const, strength: 0, reasoning: "Insufficient data." };
  }

  const closes = bars.map((b) => b.close);
  const sma20 = closes.slice(-20).reduce((s, v) => s + v, 0) / 20;
  const stdDev = Math.sqrt(closes.slice(-20).reduce((s, v) => s + Math.pow(v - sma20, 2), 0) / 20);

  const currentPrice = closes[closes.length - 1];
  const zScore = stdDev > 0 ? (currentPrice - sma20) / stdDev : 0;

  // Bollinger Band position
  const upperBand = sma20 + 2 * stdDev;
  const lowerBand = sma20 - 2 * stdDev;
  const bbPosition = stdDev > 0 ? (currentPrice - lowerBand) / (upperBand - lowerBand) : 0.5;

  let score = 50;

  // Z-Score: extreme values signal reversion
  if (zScore < -2) score += 25; // Very oversold — buy signal
  else if (zScore < -1) score += 15;
  else if (zScore > 2) score -= 25; // Very overbought — sell signal
  else if (zScore > 1) score -= 15;

  // BB position
  if (bbPosition < 0.1) score += 10;
  else if (bbPosition > 0.9) score -= 10;

  const signal = score >= 65 ? "buy" as const : score <= 35 ? "sell" as const : "hold" as const;

  return {
    strategy: "Mean Reversion",
    signal,
    strength: Math.min(100, Math.max(0, score)),
    reasoning: `Z-Score: ${zScore.toFixed(2)}, BB position: ${(bbPosition * 100).toFixed(0)}%, Price ${zScore > 0 ? "above" : "below"} mean by ${Math.abs(zScore).toFixed(1)} std devs.`,
  };
}
