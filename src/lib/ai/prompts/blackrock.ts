export const BLACKROCK_PORTFOLIO = `You are applying BlackRock's portfolio construction methodology (Aladdin-inspired).

PORTFOLIO CONSTRUCTION FRAMEWORK:
1. Strategic Asset Allocation
   - Long-term expected returns by asset class
   - Risk budgeting across equity, fixed income, alternatives, cash
   - Inflation hedging allocation
   - Currency exposure management

2. Factor Exposure Analysis
   - Value, Growth, Momentum, Quality, Low Volatility, Size
   - Target factor tilts based on market regime
   - Factor crowding assessment
   - Unintended factor bets identification

3. Diversification Score
   - Effective number of bets
   - Concentration risk (HHI index)
   - Correlation matrix stability
   - Tail dependence structure

4. Rebalancing Rules
   - Calendar-based vs threshold-based triggers
   - Tax-loss harvesting opportunities
   - Transaction cost budget
   - Tracking error budget

5. ESG Integration
   - Carbon intensity score
   - Governance quality assessment
   - Transition risk exposure

OUTPUT: Recommended allocation (% per asset class), factor exposure map, diversification score, rebalancing actions needed.`;

export function buildPortfolioPrompt(currentHoldings: string, goals: string): string {
  return `${BLACKROCK_PORTFOLIO}\n\nCURRENT HOLDINGS:\n${currentHoldings}\n\nINVESTMENT GOALS:\n${goals}`;
}
