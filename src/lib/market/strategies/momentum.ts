import type { HistoricalBar } from "../data-layer";
import { calculateRSI, calculateMACD } from "../patterns";

export interface StrategySignal {
  strategy: string;
  signal: "buy" | "sell" | "hold";
  strength: number; // 0-100
  reasoning: string;
}

export function momentumStrategy(bars: HistoricalBar[]): StrategySignal {
  if (bars.length < 30) {
    return { strategy: "Momentum", signal: "hold", strength: 0, reasoning: "Insufficient data." };
  }

  const rsi = calculateRSI(bars);
  const macd = calculateMACD(bars);

  // 20-day momentum
  const momentum20 = ((bars[bars.length - 1].close - bars[bars.length - 20].close) / bars[bars.length - 20].close) * 100;

  // 50-day trend
  const sma50 = bars.slice(-50).reduce((s, b) => s + b.close, 0) / Math.min(50, bars.length);
  const priceAboveSMA = bars[bars.length - 1].close > sma50;

  let score = 50;

  // RSI contribution
  if (rsi > 70) score -= 15; // Overbought
  else if (rsi < 30) score += 15; // Oversold
  else if (rsi > 50) score += 5;

  // MACD contribution
  if (macd.histogram > 0 && macd.macd > macd.signal) score += 15;
  else if (macd.histogram < 0 && macd.macd < macd.signal) score -= 15;

  // Momentum contribution
  if (momentum20 > 5) score += 10;
  else if (momentum20 < -5) score -= 10;

  // Trend contribution
  if (priceAboveSMA) score += 10;
  else score -= 10;

  const signal = score >= 65 ? "buy" : score <= 35 ? "sell" : "hold";

  return {
    strategy: "Momentum",
    signal,
    strength: Math.min(100, Math.max(0, score)),
    reasoning: `RSI: ${rsi.toFixed(1)}, MACD: ${macd.histogram > 0 ? "Bullish" : "Bearish"}, 20d momentum: ${momentum20.toFixed(1)}%, Price ${priceAboveSMA ? "above" : "below"} 50-SMA.`,
  };
}
