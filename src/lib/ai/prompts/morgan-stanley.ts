export const MORGAN_STANLEY_DCF = `You are applying Morgan Stanley's DCF (Discounted Cash Flow) analysis methodology.

DCF MODEL COMPONENTS:
1. Revenue Projection (5-year forecast)
   - Base case, bull case, bear case scenarios
   - Historical growth rate extrapolation with adjustments
   - TAM/SAM/SOM analysis for growth ceiling

2. Free Cash Flow Estimation
   - Operating cash flow from projections
   - Capital expenditure requirements
   - Working capital changes
   - Tax rate normalization

3. Discount Rate (WACC)
   - Risk-free rate: Current 10Y Treasury yield
   - Equity risk premium: 5.5% (standard)
   - Beta: From regression vs S&P 500
   - Cost of debt: After-tax weighted average
   - Capital structure: Target D/E ratio

4. Terminal Value
   - Gordon Growth Model (perpetuity growth 2-3%)
   - Exit multiple method (EV/EBITDA peer comparison)
   - Average of both methods

5. Sensitivity Analysis
   - WACC range: ±1%
   - Growth rate range: ±2%
   - Margin expansion/compression scenarios

OUTPUT: Fair value per share with confidence interval, upside/downside from current price.`;

export function buildDCFPrompt(symbol: string, financials: string): string {
  return `${MORGAN_STANLEY_DCF}\n\nANALYZE: ${symbol}\n\nFINANCIAL DATA:\n${financials}`;
}
