// South Africa Tax Optimization Engine
// Based on SARS capital gains tax rules

export interface TaxCalculation {
  totalGains: number;
  totalLosses: number;
  netGain: number;
  annualExclusion: number;
  taxableGain: number;
  inclusionRate: number;
  estimatedTax: number;
  optimizations: string[];
}

const SA_ANNUAL_EXCLUSION = 40000; // R40,000 annual exclusion
const SA_INCLUSION_RATE = 0.4; // 40% inclusion rate for individuals
const SA_MAX_MARGINAL_RATE = 0.45; // 45% max marginal rate

export function calculateSATax(params: {
  gains: number;
  losses: number;
  marginalRate?: number;
  isCompany?: boolean;
}): TaxCalculation {
  const marginalRate = params.marginalRate ?? 0.3;
  const inclusionRate = params.isCompany ? 0.8 : SA_INCLUSION_RATE;

  const netGain = params.gains - params.losses;
  const afterExclusion = Math.max(0, netGain - SA_ANNUAL_EXCLUSION);
  const taxableGain = afterExclusion * inclusionRate;
  const estimatedTax = taxableGain * marginalRate;

  const optimizations: string[] = [];

  if (params.losses < params.gains * 0.1) {
    optimizations.push("Consider tax-loss harvesting: Sell underperforming positions before year-end to offset gains.");
  }

  if (netGain > SA_ANNUAL_EXCLUSION * 2) {
    optimizations.push("High gains detected. Consider spreading disposals across tax years to maximize annual exclusions.");
  }

  if (!params.isCompany && marginalRate >= 0.4) {
    optimizations.push("High marginal rate. Evaluate if a holding company structure would reduce effective tax rate.");
  }

  optimizations.push("Ensure all trading costs (commissions, platform fees) are included as cost base adjustments.");
  optimizations.push("Track holding periods: Assets held >3 years may qualify for more favorable treatment in certain structures.");

  return {
    totalGains: params.gains,
    totalLosses: params.losses,
    netGain,
    annualExclusion: SA_ANNUAL_EXCLUSION,
    taxableGain,
    inclusionRate,
    estimatedTax: Math.round(estimatedTax),
    optimizations,
  };
}

export function generateTaxReport(trades: { pnl: number; symbol: string; closedAt: string }[]) {
  const byYear: Record<string, { gains: number; losses: number }> = {};

  for (const trade of trades) {
    const year = new Date(trade.closedAt).getFullYear().toString();
    if (!byYear[year]) byYear[year] = { gains: 0, losses: 0 };
    if (trade.pnl > 0) byYear[year].gains += trade.pnl;
    else byYear[year].losses += Math.abs(trade.pnl);
  }

  return Object.entries(byYear).map(([year, data]) => ({
    year,
    ...calculateSATax(data),
  }));
}
