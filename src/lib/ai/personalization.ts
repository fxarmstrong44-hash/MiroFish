export interface UserPreferences {
  favoriteAssets: string[];
  preferredStrategies: string[];
  riskComfort: number;
  tradingFrequency: "daily" | "weekly" | "monthly" | "rare";
  focusSectors: string[];
  preferredAnalysisDepth: "quick" | "standard" | "deep";
}

export function buildUserContext(
  preferences: UserPreferences,
  recentTrades: { symbol: string; pnl: number }[] = [],
  disciplineScore: number = 50
): string {
  const winRate = recentTrades.length > 0
    ? (recentTrades.filter((t) => t.pnl > 0).length / recentTrades.length) * 100
    : 0;

  const topAssets = recentTrades
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 5)
    .map((t) => t.symbol);

  return `USER PROFILE:
- Risk comfort: ${preferences.riskComfort}/5
- Trading frequency: ${preferences.tradingFrequency}
- Preferred strategies: ${preferences.preferredStrategies.join(", ") || "None set"}
- Focus sectors: ${preferences.focusSectors.join(", ") || "All"}
- Analysis depth: ${preferences.preferredAnalysisDepth}
- Recent win rate: ${winRate.toFixed(0)}%
- Top performing assets: ${topAssets.join(", ") || "N/A"}
- Discipline score: ${disciplineScore}/100
- Favorite assets: ${preferences.favoriteAssets.join(", ") || "None set"}`;
}

export function suggestStrategyAdjustments(
  currentPerformance: number,
  disciplineScore: number,
  winRate: number
): string[] {
  const suggestions: string[] = [];

  if (winRate < 40) {
    suggestions.push("Win rate below 40%. Consider reducing position sizes and focusing on higher-conviction trades only.");
  }
  if (disciplineScore < 30) {
    suggestions.push("Discipline score low. Review stop-loss adherence and avoid emotional overrides.");
  }
  if (currentPerformance < -5) {
    suggestions.push("Portfolio drawdown exceeding -5%. Consider pausing new positions and reviewing existing ones.");
  }
  if (winRate > 60 && disciplineScore > 70) {
    suggestions.push("Strong performance metrics. Consider gradually increasing position sizes within risk limits.");
  }

  return suggestions;
}
