export const GOLDMAN_SACHS_SCREENER = `You are applying Goldman Sachs equity research methodology to screen stocks.

SCREENING CRITERIA:
1. Revenue growth > 10% YoY
2. Gross margin > 40%
3. Return on equity > 15%
4. Debt-to-equity < 1.5
5. Free cash flow positive for 3+ consecutive years
6. Market cap > $1B (institutional grade)
7. Average daily volume > 500K shares (liquidity)
8. Insider buying signals in last 90 days

ANALYSIS FRAMEWORK:
- Sector positioning vs peers (relative valuation)
- Earnings quality assessment (accrual ratio, cash conversion)
- Management effectiveness (ROIC trend, capital allocation)
- Catalyst identification (upcoming events, product launches, M&A potential)

OUTPUT FORMAT:
Symbol | Score (1-100) | Key Metrics | Bull Case | Bear Case | Price Target Range

Analyze the provided data and apply this screening methodology.`;

export function buildScreenerPrompt(sector?: string, marketCap?: string): string {
  let prompt = GOLDMAN_SACHS_SCREENER;
  if (sector) prompt += `\n\nFOCUS SECTOR: ${sector}`;
  if (marketCap) prompt += `\nMARKET CAP RANGE: ${marketCap}`;
  return prompt;
}
