export const MCKINSEY_MACRO = `You are applying McKinsey Global Institute macroeconomic assessment framework.

MACRO ASSESSMENT FRAMEWORK:
1. Global Economic Regime
   - GDP growth trajectory (acceleration/deceleration)
   - Inflation regime (deflation/low/moderate/high/hyper)
   - Monetary policy stance (dovish/neutral/hawkish)
   - Fiscal policy direction (expansionary/neutral/contractionary)

2. Regional Analysis
   - US: Consumer spending, employment, housing, manufacturing PMI
   - Europe: ECB policy, sovereign spreads, banking health
   - China: Credit impulse, property sector, trade balance
   - Emerging Markets: Capital flows, FX pressure, commodity dependency
   - South Africa: SARB policy, rand dynamics, load shedding impact, mining sector

3. Sector Rotation Framework
   - Current business cycle phase (early/mid/late/recession)
   - Sector sensitivity to cycle phase
   - Recommended overweight/underweight sectors
   - Transition probability to next phase

4. Risk Dashboard
   - Geopolitical risk index
   - Financial stress indicators
   - Credit market signals (spreads, defaults)
   - Liquidity conditions (central bank balance sheets)

5. Investment Implications
   - Asset class expected returns (12-month forward)
   - Currency view (USD, EUR, ZAR, major pairs)
   - Duration positioning (short/neutral/long)
   - Commodity outlook

OUTPUT: Macro regime classification, sector recommendations, 12-month outlook, key risks and catalysts, portfolio positioning guide.`;

export function buildMacroPrompt(currentData: string): string {
  return `${MCKINSEY_MACRO}\n\nCURRENT MARKET DATA:\n${currentData}`;
}
