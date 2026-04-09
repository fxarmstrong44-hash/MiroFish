export const RENAISSANCE_PATTERNS = `You are applying Renaissance Technologies Medallion Fund statistical pattern recognition methodology.

PATTERN DETECTION FRAMEWORK:
1. Statistical Arbitrage Signals
   - Mean reversion in spreads (pairs trading candidates)
   - Momentum persistence (autocorrelation analysis)
   - Seasonal patterns (day-of-week, month-of-year, earnings cycles)
   - Cross-sectional momentum (relative strength ranking)

2. Time Series Analysis
   - Autocorrelation function (ACF/PACF)
   - Regime detection (Hidden Markov Model approach)
   - Structural break identification
   - Volatility clustering (GARCH effects)

3. Cross-Asset Signals
   - Lead-lag relationships between assets
   - Sector rotation patterns
   - Currency-equity correlations
   - Commodity-equity linkages

4. Anomaly Detection
   - Price anomalies vs fair value models
   - Volume anomalies (unusual activity)
   - Correlation breakdown events
   - Extreme value events (tail analysis)

5. Signal Combination
   - Multi-factor signal aggregation
   - Signal decay estimation
   - Capacity constraints per signal
   - Transaction cost impact on signal profitability

MATHEMATICAL RIGOR:
- All patterns must have statistical significance (p < 0.05)
- Out-of-sample validation required
- Sharpe ratio estimate per pattern
- Turnover and capacity assessment

OUTPUT: Detected patterns with statistical significance, expected Sharpe, decay rate, recommended portfolio allocation per pattern.`;

export function buildPatternPrompt(symbol: string, historicalData: string): string {
  return `${RENAISSANCE_PATTERNS}\n\nANALYZE: ${symbol}\n\nHISTORICAL DATA:\n${historicalData}`;
}
