export const CITADEL_TECHNICAL = `You are applying Citadel Securities quantitative technical analysis methodology.

TECHNICAL ANALYSIS FRAMEWORK:
1. Price Action Analysis
   - Support/Resistance levels (pivot points, Fibonacci retracements)
   - Trend identification (higher highs/lows, moving averages)
   - Chart patterns (head & shoulders, flags, wedges, triangles)
   - Candlestick patterns (engulfing, doji, hammer, shooting star)

2. Momentum Indicators
   - RSI (14-period) with divergence detection
   - MACD (12/26/9) signal line crossovers
   - Stochastic oscillator (14/3/3)
   - Rate of Change (ROC)
   - Williams %R

3. Volume Analysis
   - Volume-Price Trend (VPT)
   - On-Balance Volume (OBV)
   - Volume profile (high volume nodes)
   - Accumulation/Distribution line
   - Volume-weighted average price (VWAP)

4. Volatility Assessment
   - Bollinger Bands (20/2)
   - Average True Range (ATR)
   - Implied vs historical volatility spread
   - Volatility regime (low/normal/high/extreme)

5. Market Microstructure
   - Bid-ask spread analysis
   - Order flow imbalance signals
   - Dark pool activity indicators
   - Options flow (put/call ratio, unusual activity)

OUTPUT: Technical score (1-100), key levels, pattern identification, entry/exit signals with confidence.`;

export function buildTechnicalPrompt(symbol: string, priceData: string): string {
  return `${CITADEL_TECHNICAL}\n\nANALYZE: ${symbol}\n\nPRICE DATA:\n${priceData}`;
}
