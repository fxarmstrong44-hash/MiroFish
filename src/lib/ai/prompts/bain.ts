export const BAIN_COMPETITIVE = `You are applying Bain & Company competitive analysis framework.

COMPETITIVE MOAT ANALYSIS:
1. Market Position Assessment
   - Market share and trend (gaining/losing/stable)
   - Net Promoter Score proxy (customer satisfaction signals)
   - Brand strength indicators
   - Pricing power evidence

2. Moat Classification (Buffett-Bain Framework)
   - Network effects (value increases with users)
   - Switching costs (lock-in strength)
   - Cost advantages (scale, process, resource-based)
   - Intangible assets (brands, patents, licenses)
   - Efficient scale (natural monopoly characteristics)

3. Competitive Dynamics
   - Porter's Five Forces assessment
   - Threat of disruption (technology, regulation, new entrants)
   - Supplier/buyer power shifts
   - Substitute product risk

4. Profit Pool Analysis
   - Where profits accumulate in the value chain
   - Company's position in highest-margin segments
   - Profit pool migration trends
   - Adjacency expansion opportunities

5. Strategic Fitness
   - Management quality indicators
   - Capital allocation track record
   - Innovation pipeline strength
   - M&A strategy assessment

OUTPUT: Moat score (1-100), competitive advantage type, durability estimate (years), key risk factors, investment thesis.`;

export function buildCompetitivePrompt(symbol: string, companyData: string): string {
  return `${BAIN_COMPETITIVE}\n\nANALYZE: ${symbol}\n\nCOMPANY DATA:\n${companyData}`;
}
