export interface RiskAssessment {
  allowed: boolean;
  riskPct: number;
  positionSize: number;
  stopLoss: number;
  takeProfit: number;
  requiresOverride: boolean;
  reason: string;
}

export interface RiskParams {
  portfolioValue: number;
  entryPrice: number;
  direction: "buy" | "sell";
  confidence: number;
  volatility: number;
  maxRiskPct?: number;
  userOverride?: boolean;
}

const DEFAULT_MAX_RISK = 2.0; // 2% cap

export function assessRisk(params: RiskParams): RiskAssessment {
  const maxRisk = params.maxRiskPct ?? DEFAULT_MAX_RISK;
  const riskMultiplier = params.confidence / 100;

  // Position sizing: Kelly Criterion simplified
  const winRate = Math.min(0.7, 0.3 + (params.confidence / 200));
  const avgWin = params.volatility * 2;
  const avgLoss = params.volatility;
  const kellyFraction = Math.max(0, (winRate * avgWin - (1 - winRate) * avgLoss) / avgWin);
  const conservativeKelly = kellyFraction * 0.25; // Quarter Kelly for safety

  const riskPct = Math.min(maxRisk, conservativeKelly * 100);
  const riskAmount = params.portfolioValue * (riskPct / 100);
  const positionSize = riskAmount / (params.entryPrice * (params.volatility / 100));

  // Stop loss: based on volatility
  const stopDistance = params.entryPrice * (params.volatility / 100) * 1.5;
  const stopLoss = params.direction === "buy"
    ? params.entryPrice - stopDistance
    : params.entryPrice + stopDistance;

  // Take profit: 2:1 reward-to-risk minimum
  const tpDistance = stopDistance * (2 + riskMultiplier);
  const takeProfit = params.direction === "buy"
    ? params.entryPrice + tpDistance
    : params.entryPrice - tpDistance;

  const requiresOverride = riskPct > DEFAULT_MAX_RISK;
  const allowed = !requiresOverride || params.userOverride === true;

  return {
    allowed,
    riskPct,
    positionSize: Math.max(0, Math.floor(positionSize * 100) / 100),
    stopLoss: Math.round(stopLoss * 100) / 100,
    takeProfit: Math.round(takeProfit * 100) / 100,
    requiresOverride,
    reason: requiresOverride
      ? `Risk ${riskPct.toFixed(1)}% exceeds 2% cap. User override required.`
      : `Risk ${riskPct.toFixed(1)}% within acceptable range. Position sized at ${conservativeKelly.toFixed(3)} Kelly.`,
  };
}

export function validateAutopilotTrade(riskPct: number): { allowed: boolean; reason: string } {
  if (riskPct > DEFAULT_MAX_RISK) {
    return {
      allowed: false,
      reason: `Autopilot blocked: Risk ${riskPct.toFixed(1)}% exceeds maximum 2.0% for automated trades.`,
    };
  }
  return { allowed: true, reason: "Within autopilot risk parameters." };
}
