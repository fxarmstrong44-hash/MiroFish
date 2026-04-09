export interface ExpansionOption {
  category: string;
  title: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  minimumCapital: number;
  currency: string;
  considerations: string[];
}

export const EXPANSION_OPTIONS: ExpansionOption[] = [
  {
    category: "Offshore Investment",
    title: "SA Foreign Investment Allowance",
    description: "South African residents can transfer up to R10 million per calendar year offshore with SARS tax clearance.",
    riskLevel: "low",
    minimumCapital: 50000,
    currency: "ZAR",
    considerations: [
      "Requires SARS tax clearance for amounts >R1 million",
      "Subject to exchange control regulations",
      "Foreign investment income must be declared in SA tax return",
      "Consider rand hedge benefits during ZAR weakness",
    ],
  },
  {
    category: "Currency Diversification",
    title: "Multi-Currency Portfolio",
    description: "Hold assets across USD, EUR, GBP, and other major currencies to reduce single-currency risk.",
    riskLevel: "medium",
    minimumCapital: 100000,
    currency: "ZAR",
    considerations: [
      "USD typically strengthens during global risk-off events",
      "EUR exposure for European market access",
      "GBP for UK property and equities",
      "Monitor SARB monetary policy for ZAR direction",
    ],
  },
  {
    category: "International ETFs",
    title: "JSE-Listed Global ETFs",
    description: "Access international markets through JSE-listed ETFs without forex complexities.",
    riskLevel: "low",
    minimumCapital: 5000,
    currency: "ZAR",
    considerations: [
      "No need for offshore allowance approval",
      "Rand-denominated but foreign-currency exposure",
      "Lower fees than direct offshore investing",
      "Examples: Satrix MSCI World, CoreShares S&P 500",
    ],
  },
  {
    category: "Offshore Property",
    title: "International Real Estate",
    description: "Invest in property markets outside South Africa for geographic diversification.",
    riskLevel: "high",
    minimumCapital: 2000000,
    currency: "ZAR",
    considerations: [
      "Requires tax clearance and exchange control approval",
      "Consider tax implications in both countries",
      "Property management challenges from abroad",
      "Popular markets: Portugal, UAE, Mauritius (tax treaties)",
    ],
  },
  {
    category: "Structured Products",
    title: "Offshore Endowment Policies",
    description: "Tax-efficient offshore investment vehicles structured as endowment policies.",
    riskLevel: "medium",
    minimumCapital: 500000,
    currency: "ZAR",
    considerations: [
      "Taxed at flat 30% within the policy (not marginal rate)",
      "5-year restriction period applies",
      "Good for high-income individuals (marginal rate >30%)",
      "Wide fund choice within the wrapper",
    ],
  },
];

export function getRecommendedExpansions(capitalZAR: number, riskTolerance: number): ExpansionOption[] {
  return EXPANSION_OPTIONS.filter((opt) => {
    if (capitalZAR < opt.minimumCapital) return false;
    if (riskTolerance < 2 && opt.riskLevel === "high") return false;
    if (riskTolerance < 3 && opt.riskLevel === "medium") return false;
    return true;
  });
}
