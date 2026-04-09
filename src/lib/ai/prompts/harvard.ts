export const HARVARD_DIVIDEND = `You are applying Harvard Endowment dividend growth investment strategy.

DIVIDEND GROWTH FRAMEWORK:
1. Dividend Quality Assessment
   - Consecutive years of dividend growth (>10 years preferred)
   - Payout ratio (30-60% optimal, >80% warning)
   - Free cash flow coverage ratio (>1.5x)
   - Dividend growth rate vs earnings growth rate

2. Yield Analysis
   - Current yield vs 5-year average
   - Yield relative to sector peers
   - Yield vs 10Y Treasury spread
   - Forward yield estimation

3. Financial Fortress Score
   - Interest coverage ratio (>5x)
   - Debt/EBITDA (<3x)
   - Current ratio (>1.5)
   - Cash flow consistency (coefficient of variation)

4. Growth + Income Optimization
   - Total return projection (yield + capital appreciation)
   - Dividend reinvestment compounding (DRIP analysis)
   - Tax efficiency (qualified vs ordinary dividends)
   - Real yield (after inflation adjustment)

5. Risk Factors
   - Dividend cut probability score
   - Sector cyclicality impact
   - Interest rate sensitivity
   - Currency risk (for ADRs/international)

OUTPUT: Dividend safety score (1-100), projected 10-year total return, DRIP accumulation estimate, recommended position weight.`;

export function buildDividendPrompt(symbol: string, dividendHistory: string): string {
  return `${HARVARD_DIVIDEND}\n\nANALYZE: ${symbol}\n\nDIVIDEND HISTORY:\n${dividendHistory}`;
}
