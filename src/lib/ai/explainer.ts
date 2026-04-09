import type { CouncilDecision } from "./council";
import type { SimulationResult } from "./simulation-engine";

export interface TradeExplanation {
  summary: string;
  factors: ExplanationFactor[];
  riskStatement: string;
  probabilityStatement: string;
}

export interface ExplanationFactor {
  label: string;
  value: string;
  impact: "positive" | "negative" | "neutral";
}

export function explainTrade(
  decision: CouncilDecision,
  simulation: SimulationResult
): TradeExplanation {
  const factors: ExplanationFactor[] = [];

  // Trend factor
  const trendDirection = decision.direction === "buy" ? "Uptrend detected" : decision.direction === "sell" ? "Downtrend detected" : "No clear trend";
  factors.push({
    label: "Trend",
    value: trendDirection,
    impact: decision.direction !== "hold" ? "positive" : "neutral",
  });

  // Consensus factor
  const consensusStrength = decision.consensusScore >= 70 ? "Strong" : decision.consensusScore >= 50 ? "Moderate" : "Weak";
  factors.push({
    label: "Council Consensus",
    value: `${consensusStrength} (${decision.consensusScore.toFixed(0)}%)`,
    impact: decision.consensusScore >= 50 ? "positive" : "negative",
  });

  // Confidence factor
  factors.push({
    label: "Confidence",
    value: `${decision.confidence.toFixed(1)}%`,
    impact: decision.confidence >= 60 ? "positive" : decision.confidence >= 40 ? "neutral" : "negative",
  });

  // Risk factor
  factors.push({
    label: "Risk",
    value: `${decision.riskPct.toFixed(1)}%`,
    impact: decision.riskPct <= 2 ? "positive" : "negative",
  });

  // Win probability factor
  factors.push({
    label: "Win Probability",
    value: `${simulation.probabilityWin}%`,
    impact: simulation.probabilityWin >= 60 ? "positive" : simulation.probabilityWin >= 45 ? "neutral" : "negative",
  });

  const positiveFactors = factors.filter((f) => f.impact === "positive").length;
  const summary = `Trade ${decision.direction.toUpperCase()} ${decision.symbol}: ${factors
    .map((f) => `${f.label}: ${f.value}`)
    .join(", ")}`;

  return {
    summary,
    factors,
    riskStatement: `Portfolio risk: ${decision.riskPct.toFixed(1)}%. ${decision.riskPct > 2 ? "REQUIRES USER OVERRIDE — exceeds 2% cap." : "Within acceptable limits."}`,
    probabilityStatement: `Before trade: ${simulation.probabilityWin}% win probability, ${simulation.probabilityLoss}% loss probability. ${simulation.recommendation}`,
  };
}
