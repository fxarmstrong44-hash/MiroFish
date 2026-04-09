import type { HistoricalBar } from "./data-layer";

export interface PatternResult {
  pattern: string;
  type: "bullish" | "bearish" | "neutral";
  confidence: number;
  description: string;
}

export function detectSupportResistance(bars: HistoricalBar[]): { support: number[]; resistance: number[] } {
  if (bars.length < 10) return { support: [], resistance: [] };

  const pivots: { price: number; type: "high" | "low" }[] = [];

  for (let i = 2; i < bars.length - 2; i++) {
    if (bars[i].high > bars[i - 1].high && bars[i].high > bars[i - 2].high &&
        bars[i].high > bars[i + 1].high && bars[i].high > bars[i + 2].high) {
      pivots.push({ price: bars[i].high, type: "high" });
    }
    if (bars[i].low < bars[i - 1].low && bars[i].low < bars[i - 2].low &&
        bars[i].low < bars[i + 1].low && bars[i].low < bars[i + 2].low) {
      pivots.push({ price: bars[i].low, type: "low" });
    }
  }

  return {
    support: pivots.filter((p) => p.type === "low").map((p) => p.price).slice(-3),
    resistance: pivots.filter((p) => p.type === "high").map((p) => p.price).slice(-3),
  };
}

export function detectCandlestickPatterns(bars: HistoricalBar[]): PatternResult[] {
  const patterns: PatternResult[] = [];
  if (bars.length < 3) return patterns;

  const last = bars[bars.length - 1];
  const prev = bars[bars.length - 2];

  const bodySize = Math.abs(last.close - last.open);
  const upperWick = last.high - Math.max(last.close, last.open);
  const lowerWick = Math.min(last.close, last.open) - last.low;
  const totalRange = last.high - last.low;

  // Doji
  if (totalRange > 0 && bodySize / totalRange < 0.1) {
    patterns.push({ pattern: "Doji", type: "neutral", confidence: 70, description: "Indecision candle — market at equilibrium." });
  }

  // Hammer (bullish reversal)
  if (lowerWick > bodySize * 2 && upperWick < bodySize * 0.5 && prev.close < prev.open) {
    patterns.push({ pattern: "Hammer", type: "bullish", confidence: 65, description: "Potential bullish reversal after downtrend." });
  }

  // Shooting Star (bearish reversal)
  if (upperWick > bodySize * 2 && lowerWick < bodySize * 0.5 && prev.close > prev.open) {
    patterns.push({ pattern: "Shooting Star", type: "bearish", confidence: 65, description: "Potential bearish reversal after uptrend." });
  }

  // Bullish Engulfing
  if (last.close > last.open && prev.close < prev.open &&
      last.open < prev.close && last.close > prev.open) {
    patterns.push({ pattern: "Bullish Engulfing", type: "bullish", confidence: 75, description: "Strong bullish reversal signal." });
  }

  // Bearish Engulfing
  if (last.close < last.open && prev.close > prev.open &&
      last.open > prev.close && last.close < prev.open) {
    patterns.push({ pattern: "Bearish Engulfing", type: "bearish", confidence: 75, description: "Strong bearish reversal signal." });
  }

  return patterns;
}

export function calculateRSI(bars: HistoricalBar[], period = 14): number {
  if (bars.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = bars.length - period; i < bars.length; i++) {
    const change = bars[i].close - bars[i - 1].close;
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calculateMACD(bars: HistoricalBar[]): { macd: number; signal: number; histogram: number } {
  if (bars.length < 26) return { macd: 0, signal: 0, histogram: 0 };

  const ema = (data: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const result = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(data[i] * k + result[i - 1] * (1 - k));
    }
    return result;
  };

  const closes = bars.map((b) => b.close);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);

  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = ema(macdLine.slice(26), 9);

  const macd = macdLine[macdLine.length - 1];
  const signal = signalLine[signalLine.length - 1];

  return { macd, signal, histogram: macd - signal };
}
