export interface SimulationResult {
  probabilityWin: number;
  probabilityLoss: number;
  expectedReturn: number;
  maxDrawdown: number;
  sharpeEstimate: number;
  recommendation: string;
}

export function simulateTrade(params: {
  confidence: number;
  consensusScore: number;
  riskPct: number;
  volatility: number;
  historicalWinRate?: number;
}): SimulationResult {
  const baseWinRate = params.historicalWinRate ?? 0.5;

  // Adjust win rate based on council consensus and confidence
  const consensusBoost = (params.consensusScore / 100) * 0.15;
  const confidenceBoost = (params.confidence / 100) * 0.1;
  const adjustedWinRate = Math.min(0.85, baseWinRate + consensusBoost + confidenceBoost);

  const probabilityWin = Math.round(adjustedWinRate * 100);
  const probabilityLoss = 100 - probabilityWin;

  // Expected return: win_prob * avg_win - loss_prob * avg_loss
  const avgWin = params.volatility * 2;
  const avgLoss = params.volatility;
  const expectedReturn = (adjustedWinRate * avgWin) - ((1 - adjustedWinRate) * avgLoss);

  // Max drawdown estimate
  const maxDrawdown = params.riskPct * 3;

  // Sharpe estimate (simplified)
  const excessReturn = expectedReturn - 0.05; // Risk-free rate ~5%
  const sharpeEstimate = params.volatility > 0 ? excessReturn / params.volatility : 0;

  let recommendation: string;
  if (probabilityWin >= 70 && params.riskPct <= 2) {
    recommendation = "Strong setup. Proceed with calculated position size.";
  } else if (probabilityWin >= 55) {
    recommendation = "Moderate setup. Consider reduced position size.";
  } else {
    recommendation = "Weak setup. Recommend passing on this trade.";
  }

  return {
    probabilityWin,
    probabilityLoss,
    expectedReturn: Math.round(expectedReturn * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    sharpeEstimate: Math.round(sharpeEstimate * 100) / 100,
    recommendation,
  };
}
