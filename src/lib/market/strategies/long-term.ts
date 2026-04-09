import type { HistoricalBar } from "../data-layer";

export function longTermStrategy(bars: HistoricalBar[]) {
  if (bars.length < 50) {
    return { strategy: "Long-Term Value", signal: "hold" as const, strength: 0, reasoning: "Insufficient data for long-term analysis." };
  }

  const closes = bars.map((b) => b.close);
  const sma50 = closes.slice(-50).reduce((s, v) => s + v, 0) / 50;
  const sma200 = bars.length >= 200
    ? closes.slice(-200).reduce((s, v) => s + v, 0) / 200
    : sma50;

  const current = closes[closes.length - 1];

  // Golden cross / Death cross
  const goldenCross = sma50 > sma200;

  // Long-term trend
  const trend6m = bars.length >= 126
    ? ((current - closes[closes.length - 126]) / closes[closes.length - 126]) * 100
    : 0;

  // Drawdown from high
  const high52w = bars.length >= 252
    ? Math.max(...closes.slice(-252))
    : Math.max(...closes);
  const drawdown = ((current - high52w) / high52w) * 100;

  let score = 50;

  if (goldenCross) score += 15;
  else score -= 15;

  if (trend6m > 10) score += 10;
  else if (trend6m < -10) score -= 10;

  // Buy opportunity on drawdown
  if (drawdown < -20 && goldenCross) score += 15;
  if (drawdown < -30) score += 10;

  // Price above 200 SMA = long-term bullish
  if (current > sma200) score += 10;
  else score -= 10;

  const signal = score >= 65 ? "buy" as const : score <= 35 ? "sell" as const : "hold" as const;

  return {
    strategy: "Long-Term Value",
    signal,
    strength: Math.min(100, Math.max(0, score)),
    reasoning: `${goldenCross ? "Golden cross" : "Death cross"} active, 6m trend: ${trend6m.toFixed(1)}%, Drawdown from 52w high: ${drawdown.toFixed(1)}%, Price ${current > sma200 ? "above" : "below"} 200-SMA.`,
  };
}
