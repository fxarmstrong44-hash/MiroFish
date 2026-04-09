export interface TierConfig {
  id: string;
  name: string;
  priceUSD: number;
  priceZAR: number;
  features: string[];
  limits: {
    councilQueriesPerDay: number;
    simulatorAccess: boolean;
    autopilot: boolean;
    institutionalPrompts: boolean;
    taxTools: boolean;
    dealMarketplace: boolean;
    networkAccess: boolean;
    vaultAccess: boolean;
    privateBank: boolean;
    directAPI: boolean;
  };
  stripePriceId?: string;
}

export const TIERS: Record<string, TierConfig> = {
  free: {
    id: "free",
    name: "Free",
    priceUSD: 0,
    priceZAR: 0,
    features: [
      "Market data overview",
      "3 Lucky AI queries per day",
      "Limited paper trading simulator",
      "Basic portfolio view",
    ],
    limits: {
      councilQueriesPerDay: 3,
      simulatorAccess: true,
      autopilot: false,
      institutionalPrompts: false,
      taxTools: false,
      dealMarketplace: false,
      networkAccess: false,
      vaultAccess: false,
      privateBank: false,
      directAPI: false,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    priceUSD: 29,
    priceZAR: 493,
    features: [
      "Everything in Free",
      "20 Lucky AI queries per day",
      "Full paper trading simulator",
      "Basic alerts (5 active)",
      "Portfolio tracker",
    ],
    limits: {
      councilQueriesPerDay: 20,
      simulatorAccess: true,
      autopilot: false,
      institutionalPrompts: false,
      taxTools: false,
      dealMarketplace: false,
      networkAccess: false,
      vaultAccess: false,
      privateBank: false,
      directAPI: false,
    },
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceUSD: 99,
    priceZAR: 1683,
    features: [
      "Everything in Starter",
      "Unlimited Lucky AI queries",
      "Full AI Council access",
      "Autopilot Wealth Mode",
      "Institutional analysis prompts",
      "Tax optimization tools",
      "Unlimited alerts",
      "SPARC mode",
    ],
    limits: {
      councilQueriesPerDay: -1, // unlimited
      simulatorAccess: true,
      autopilot: true,
      institutionalPrompts: true,
      taxTools: true,
      dealMarketplace: false,
      networkAccess: false,
      vaultAccess: false,
      privateBank: false,
      directAPI: false,
    },
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
  elite: {
    id: "elite",
    name: "Elite",
    priceUSD: 299,
    priceZAR: 5084,
    features: [
      "Everything in Pro",
      "Deal Marketplace access",
      "Strategic Network",
      "Execution Vault",
      "Global Wealth Expansion tools",
      "Business Builder Engine",
      "Priority AI processing",
    ],
    limits: {
      councilQueriesPerDay: -1,
      simulatorAccess: true,
      autopilot: true,
      institutionalPrompts: true,
      taxTools: true,
      dealMarketplace: true,
      networkAccess: true,
      vaultAccess: true,
      privateBank: false,
      directAPI: false,
    },
    stripePriceId: process.env.STRIPE_ELITE_PRICE_ID,
  },
  secret: {
    id: "secret",
    name: "Vaultr Elite",
    priceUSD: 10000,
    priceZAR: 169884,
    features: [
      "Everything in Elite",
      "Private Banking Interface",
      "Concierge AI (dedicated instance)",
      "Custom strategy builder",
      "Direct API access",
      "White-glove onboarding",
      "Exclusive market intelligence",
    ],
    limits: {
      councilQueriesPerDay: -1,
      simulatorAccess: true,
      autopilot: true,
      institutionalPrompts: true,
      taxTools: true,
      dealMarketplace: true,
      networkAccess: true,
      vaultAccess: true,
      privateBank: true,
      directAPI: true,
    },
    stripePriceId: process.env.STRIPE_SECRET_PRICE_ID,
  },
};

export function getTierConfig(tier: string): TierConfig {
  return TIERS[tier] || TIERS.free;
}

export function canAccessFeature(tier: string, feature: keyof TierConfig["limits"]): boolean {
  const config = getTierConfig(tier);
  const value = config.limits[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return false;
}
