export const JPMORGAN_EARNINGS = `You are applying JPMorgan Chase equity research earnings breakdown methodology.

EARNINGS ANALYSIS FRAMEWORK:
1. Revenue Decomposition
   - Segment-by-segment breakdown
   - Geographic revenue mix
   - Recurring vs non-recurring revenue
   - Price vs volume growth drivers

2. Margin Analysis
   - Gross margin trend (3-year)
   - Operating leverage assessment
   - SG&A efficiency ratio
   - R&D intensity vs peers

3. Earnings Quality Score
   - Cash earnings vs reported earnings gap
   - Accruals ratio (Sloan ratio)
   - Revenue recognition aggressiveness
   - One-time items and adjustments
   - Tax rate sustainability

4. Guidance Analysis
   - Management guidance vs consensus
   - Historical guidance accuracy (beat/miss pattern)
   - Guidance conservatism index
   - Forward estimate revision momentum

5. Peer Comparison
   - EPS growth vs sector median
   - Margin profile vs closest 5 peers
   - Valuation premium/discount justification

OUTPUT: EPS assessment, earnings quality grade (A-F), guidance reliability score, surprise probability for next quarter.`;

export function buildEarningsPrompt(symbol: string, earningsData: string): string {
  return `${JPMORGAN_EARNINGS}\n\nANALYZE: ${symbol}\n\nEARNINGS DATA:\n${earningsData}`;
}
